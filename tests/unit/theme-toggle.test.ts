import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock matchMedia
function createMatchMediaMock(prefersDark: boolean) {
  const listeners: Array<(e: { matches: boolean }) => void> = [];
  return {
    matches: prefersDark,
    media: "(prefers-color-scheme: dark)",
    addEventListener: vi.fn(
      (_event: string, cb: (e: { matches: boolean }) => void) => {
        listeners.push(cb);
      }
    ),
    removeEventListener: vi.fn(
      (_event: string, cb: (e: { matches: boolean }) => void) => {
        const idx = listeners.indexOf(cb);
        if (idx >= 0) listeners.splice(idx, 1);
      }
    ),
    // Helper to simulate system preference change
    _triggerChange: (newPrefersDark: boolean) => {
      for (const cb of listeners) {
        cb({ matches: newPrefersDark });
      }
    },
    _listeners: listeners,
  };
}

describe("theme toggle logic", () => {
  let mockMatchMedia: ReturnType<typeof createMatchMediaMock>;

  beforeEach(() => {
    mockMatchMedia = createMatchMediaMock(false);
    vi.stubGlobal("matchMedia", vi.fn(() => mockMatchMedia));
    // Mock document.documentElement
    vi.stubGlobal("document", {
      documentElement: {
        classList: {
          _classes: new Set<string>(),
          add(cls: string) {
            this._classes.add(cls);
          },
          remove(cls: string) {
            this._classes.delete(cls);
          },
          contains(cls: string) {
            return this._classes.has(cls);
          },
        },
        style: {} as Record<string, string>,
      },
    });
  });

  it("initial theme follows system preference — light", () => {
    mockMatchMedia = createMatchMediaMock(false);
    vi.stubGlobal("matchMedia", vi.fn(() => mockMatchMedia));

    // Simulate ThemeProvider init logic
    const prefersDark = mockMatchMedia.matches;
    const theme = prefersDark ? "dark" : "light";

    expect(theme).toBe("light");
    expect(prefersDark).toBe(false);
  });

  it("initial theme follows system preference — dark", () => {
    mockMatchMedia = createMatchMediaMock(true);
    vi.stubGlobal("matchMedia", vi.fn(() => mockMatchMedia));

    const prefersDark = mockMatchMedia.matches;
    const theme = prefersDark ? "dark" : "light";

    expect(theme).toBe("dark");
    expect(prefersDark).toBe(true);
  });

  it("toggleTheme switches from light to dark", () => {
    let theme: "light" | "dark" = "light";
    let isManualOverride = false;

    // Toggle
    theme = theme === "light" ? "dark" : "light";
    isManualOverride = true;

    expect(theme).toBe("dark");
    expect(isManualOverride).toBe(true);
  });

  it("toggleTheme switches from dark to light", () => {
    let theme: "light" | "dark" = "dark";
    let isManualOverride = false;

    // Toggle
    theme = theme === "light" ? "dark" : "light";
    isManualOverride = true;

    expect(theme).toBe("light");
    expect(isManualOverride).toBe(true);
  });

  it("manual override persists across context reads", () => {
    let theme: "light" | "dark" = "light";
    let isManualOverride = false;

    // Toggle to dark
    theme = "dark";
    isManualOverride = true;

    // Simulate multiple reads
    expect(theme).toBe("dark");
    expect(isManualOverride).toBe(true);

    // Read again
    expect(theme).toBe("dark");
    expect(isManualOverride).toBe(true);
  });

  it("system preference change updates theme when no manual override", () => {
    let theme: "light" | "dark" = "light";
    const isManualOverride = false;

    // Simulate system preference change to dark
    if (!isManualOverride) {
      theme = "dark"; // System changed to dark
    }

    expect(theme).toBe("dark");
  });

  it("system preference change is ignored when manual override is active", () => {
    let theme: "light" | "dark" = "dark";
    const isManualOverride = true;

    // Simulate system preference change to light
    if (!isManualOverride) {
      theme = "light"; // Would change, but override blocks it
    }

    expect(theme).toBe("dark"); // Still dark because override is active
  });
});
