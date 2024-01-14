import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";

async function handler(
  request: NextRequest,
  { params }: { params: { query: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const products = new Product(db.product, null, null);
  const productsResult = await products.searchProducts(params.query);

  if (productsResult) {
    await db.product.updateMany({
      where: {
        id: {
          in: productsResult.map((product) => product.id),
        },
      },
      data: {
        search_count: {
          increment: 1,
        },
      },
    });
    return NextResponse.json({ ok: true, result: productsResult });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
