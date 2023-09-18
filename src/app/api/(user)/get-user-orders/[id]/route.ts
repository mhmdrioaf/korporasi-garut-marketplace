import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { CUSTOMER_ORDERS } from "@/lib/constants";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const userOrders = CUSTOMER_ORDERS.filter(
    (order) => order.customer_id === params.id
  );

  if (userOrders) {
    return NextResponse.json({ ok: true, result: userOrders });
  } else {
    return NextResponse.json({ ok: false, result: [] });
  }
}

export { handler as GET };
