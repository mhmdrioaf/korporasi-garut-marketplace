import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

interface IVariantDeleteBody {
  product_id: string;
}

async function handler(request: NextRequest) {
  const body: IVariantDeleteBody = await request.json();

  try {
    const products = new Product(db.product, null, null);
    const deleteProduct = await products.deleteProduct(body.product_id);
    if (deleteProduct) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil menghapus data produk.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Telah terjadi kesalahan ketika menghapus data produk.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan ketika menghapus data produk.",
    });
  }
}

export { handler as DELETE };
