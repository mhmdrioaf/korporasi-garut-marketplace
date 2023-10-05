import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";

async function handler(request: NextRequest) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const products = new Product(db.product, null, null);
  const listProducts = await products.listProduct();

  if (listProducts) {
    return NextResponse.json({ ok: true, result: listProducts });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
