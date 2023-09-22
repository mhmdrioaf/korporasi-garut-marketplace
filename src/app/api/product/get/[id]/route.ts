import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const products = new Product(db.product, null);
  const product = await products.getProductDetail(params.id);

  if (product) {
    return NextResponse.json({ ok: true, result: product });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
