import { NextRequest } from "next/server";
import { getCustomers, getCustomersWithAppCount } from "@/lib/customers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const include = searchParams.get("include") ?? "";

  if (include.split(",").includes("applicationCount")) {
    const customers = await getCustomersWithAppCount();
    return Response.json({ customers });
  }

  const customers = await getCustomers();
  return Response.json({ customers });
}
