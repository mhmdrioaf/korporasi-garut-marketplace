import { db } from "@/lib/db";
import ProductCategory from "@/lib/prisma-classes/ProductCategory";
import { NextRequest, NextResponse } from "next/server";

interface IUpdateCategoryBody {
  category_id: string;
  category_name: string;
}

async function handler(request: NextRequest) {
  const body: IUpdateCategoryBody = await request.json();

  try {
    const categories = new ProductCategory(db.product_category);
    const updateCategory = await categories.updateCategory(body);

    if (updateCategory) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengubah data kategori produk.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Gagal mengubah data kategori produk.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Gagal mengubah data kategori produk.",
    });
  }
}

export { handler as PATCH };
