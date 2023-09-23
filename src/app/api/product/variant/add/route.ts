import { db } from "@/lib/db";
import Product, { IAddProductVariant } from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const body: IAddProductVariant = await request.json();

  try {
    const products = new Product(db.product, db.product_variant, null);
    const createNewVariant = await products.addProductVariant(body);

    if (createNewVariant) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil menambahkan varian baru.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Telah terjadi kesalahan ketika menambahkan varian baru.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan ketika menambahkan varian baru.",
    });
  }
}

export { handler as PUT };
