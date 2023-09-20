import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const userOrders = await db.orders.findMany({
    where: {
      user_id: {
        equals: parseInt(params.id),
      },
    },
    include: {
      order_item: true,
    },
  });

  if (userOrders) {
    return NextResponse.json({ ok: true, result: userOrders });
  } else {
    return NextResponse.json({ ok: false, result: [] });
  }
}

export { handler as GET };
