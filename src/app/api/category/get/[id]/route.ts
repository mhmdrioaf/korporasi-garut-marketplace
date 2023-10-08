import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ProductCategory from "@/lib/prisma-classes/ProductCategory";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const categories = new ProductCategory(db.product_category);
  const category = await categories.getCategoryDetail(params.id);

  if (category) {
    return NextResponse.json({ ok: true, result: category });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
