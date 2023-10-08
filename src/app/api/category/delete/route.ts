import { db } from "@/lib/db";
import ProductCategory from "@/lib/prisma-classes/ProductCategory";
import { NextRequest, NextResponse } from "next/server";

interface IDeleteCategoryBody {
  category_id: string;
}

async function handler(request: NextRequest) {
  const body: IDeleteCategoryBody = await request.json();

  try {
    const categories = new ProductCategory(db.product_category);
    const deleteCategory = await categories.deleteCategory(body.category_id);

    if (deleteCategory) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil menghapus data kategori produk.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Gagal menghapus kategori produk.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Gagal menghapus kategori produk.",
    });
  }
}

export { handler as DELETE };
