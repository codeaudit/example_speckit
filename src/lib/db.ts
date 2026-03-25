import Database from "better-sqlite3";
import path from "path";

// For tests, allow in-memory database
let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dbPath =
    process.env.DATABASE_PATH || path.join(process.cwd(), "data", "loan-app.db");
  // Ensure data directory exists for file-based DB
  if (dbPath !== ":memory:") {
    const fs = require("fs");
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}

// For testing: reset the singleton
export function resetDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// For testing: set a specific database instance
export function setDb(instance: Database.Database): void {
  db = instance;
  runMigrations(db);
}

interface Migration {
  version: number;
  sql: string;
}

const migrations: Migration[] = [
  {
    version: 1,
    sql: `CREATE TABLE IF NOT EXISTS loan_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reference_number TEXT NOT NULL UNIQUE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  annual_income REAL NOT NULL CHECK(annual_income > 0),
  monthly_debts REAL NOT NULL CHECK(monthly_debts >= 0),
  credit_score INTEGER NOT NULL CHECK(credit_score >= 300 AND credit_score <= 850),
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('purchase', 'refinance')),
  loan_amount REAL NOT NULL CHECK(loan_amount >= 1000 AND loan_amount <= 500000),
  loan_term_months INTEGER NOT NULL CHECK(loan_term_months >= 6 AND loan_term_months <= 360),
  interest_rate REAL NOT NULL CHECK(interest_rate >= 0.001 AND interest_rate <= 0.20),
  property_value REAL NOT NULL CHECK(property_value > 0),
  purchase_price REAL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Rejected')),
  qualification_data TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`,
  },
  {
    version: 2,
    sql: `CREATE TABLE IF NOT EXISTS decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL UNIQUE REFERENCES loan_applications(id),
  decision_type TEXT NOT NULL CHECK(decision_type IN ('Approved', 'Rejected')),
  decision_note TEXT,
  is_override INTEGER NOT NULL DEFAULT 0,
  decided_at TEXT NOT NULL DEFAULT (datetime('now'))
);`,
  },
];

function runMigrations(database: Database.Database): void {
  const result = database.pragma("user_version") as Array<{ user_version: number }>;
  let currentVersion = result[0].user_version;

  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      database.exec(migration.sql);
      database.pragma(`user_version = ${migration.version}`);
      currentVersion = migration.version;
    }
  }
}
