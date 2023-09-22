import { db } from "@/lib/db";
import ProductCategory from "@/lib/prisma-classes/ProductCategory";
import { NextRequest, NextResponse } from "next/server";

interface IAddCategoryBody {
  category_name: string;
}

async function handler(request: NextRequest) {
  const body: IAddCategoryBody = await request.json();

  try {
    const categories = new ProductCategory(db.product_category);
    const addNewCategory = await categories.addCategory(body.category_name);

    if (addNewCategory) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil menambahkan kategori baru.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Gagal menambahkan kategori produk.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Gagal menambahkan kategori produk.",
    });
  }
}

export { handler as PUT };
