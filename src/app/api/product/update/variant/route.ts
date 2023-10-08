import { db } from "@/lib/db";
import { TProductVariant } from "@/lib/globals";
import Product from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

interface IProductVariantUpdateRequestBody {
  product_id: string;
  variant: TProductVariant[];
}

async function handler(request: NextRequest) {
  const body: IProductVariantUpdateRequestBody = await request.json();

  try {
    const products = new Product(
      db.product,
      db.product_variant,
      db.product_variant_item
    );

    const updateVariant = await products.productVariantUpdate(body);
    if (updateVariant) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengubah data variant.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Telah terjadi kesalahan ketika mengubah data variant.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan ketika mengubah data variant.",
    });
  }
}

export { handler as PATCH };
