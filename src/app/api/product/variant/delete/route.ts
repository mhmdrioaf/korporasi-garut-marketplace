import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

interface IVariantDeleteBody {
  variant_id: string;
}

async function handler(request: NextRequest) {
  const body: IVariantDeleteBody = await request.json();

  try {
    const products = new Product(db.product, db.product_variant, null);
    const deleteVariant = await products.deleteProductVariant(body.variant_id);
    if (deleteVariant) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil menghapus data varian.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Telah terjadi kesalahan ketika menghapus data varian.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan ketika menghapus data varian.",
    });
  }
}

export { handler as DELETE };
