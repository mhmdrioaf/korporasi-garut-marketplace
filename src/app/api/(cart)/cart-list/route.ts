import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Carts from "@/lib/prisma-classes/Carts";

async function handler(request: NextRequest) {
  const user_id = request.headers.get("user_id") || null;

  const carts = new Carts(db.customer_cart, db.customer_cart_item);

  if (!user_id) {
    return NextResponse.json({ ok: false, result: null });
  } else {
    const cart = await carts.getCart(parseInt(user_id));

    if (cart) {
      return NextResponse.json({ ok: true, result: cart });
    } else {
      return NextResponse.json({ ok: false, result: null });
    }
  }
}

export { handler as GET };
