import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ProductCategory from "@/lib/prisma-classes/ProductCategory";

async function handler(request: NextRequest) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const categories = new ProductCategory(db.product_category);
  const listCategories = await categories.listCategory();

  if (listCategories) {
    return NextResponse.json({ ok: true, result: listCategories });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
