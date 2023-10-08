import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

interface IVariantItemDeleteBody {
  variant_item_id: string;
}

async function handler(request: NextRequest) {
  const body: IVariantItemDeleteBody = await request.json();

  try {
    const products = new Product(db.product, null, db.product_variant_item);
    const deleteVariantItem = await products.deleteProductVariantItems(
      body.variant_item_id
    );
    if (deleteVariantItem) {
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
