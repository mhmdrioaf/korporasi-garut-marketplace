import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

type TProductVariantInput = {
  variant_id: string;
  variant_title: string;
  variant_item: TProductVariantItemInput[];
};

type TProductVariantItemInput = {
  variant_item_id: string;
  variant_name: string;
  variant_value: string;
  variant_price: number;
};

interface IProductUpdateRequestBody {
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
  secret: string;
  id: string;
  deletedVariantItems: string[];
  deletedVariant: string[];
  tags: string[];
}

async function handler(request: NextRequest) {
  const body: IProductUpdateRequestBody = await request.json();

  try {
    const products = new Product(
      db.product,
      db.product_variant,
      db.product_variant_item
    );
    const updateProduct = await products.updateProduct(body);

    if (body.variant && body.variant.length > 0) {
      await products.productVariantUpdate({
        product_id: body.id,
        variant: body.variant,
      });
    }

    if (body.deletedVariantItems && body.deletedVariantItems.length > 0) {
      for (const id of body.deletedVariantItems) {
        await products.deleteProductVariantItems(id);
      }
    }

    if (body.deletedVariant && body.deletedVariant.length > 0) {
      for (const id of body.deletedVariant) {
        await products.deleteProductVariant(id);
      }
    }

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
