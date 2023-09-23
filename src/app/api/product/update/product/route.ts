import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

type TProductVariantInput = {
  variant_title: string;
};

type TProductVariantItemInput = {
  variant_name: string;
  variant_value: string;
  variant_price: number;
};

interface IProductUpdateRequestBody {
  id: string;
  title: string;
  description: string;
  images: string[];
  price: number;
  unit: string;
  weight: number;
  stock: number;
  seller_id: string;
  variant: TProductVariantInput[] | null;
  variant_items: TProductVariantItemInput[] | null;
  category_id: string | null;
}

async function handler(request: NextRequest) {
  const body: IProductUpdateRequestBody = await request.json();

  try {
    const products = new Product(db.product, null, null);
    const updateProduct = await products.updateProduct(body);

    if (updateProduct) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengubah data produk.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Telah terjadi kesalahan ketika mengubah data produk.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan ketika mengubah data produk.",
    });
  }
}

export { handler as PATCH };
