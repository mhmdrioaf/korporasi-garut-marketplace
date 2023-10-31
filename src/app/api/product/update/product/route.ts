import { db } from "@/lib/db";
import { IProductInput } from "@/lib/hooks/context/productContextType";
import Product from "@/lib/prisma-classes/Product";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface IProductUpdateRequestBody extends IProductInput {
  id: string;
  tags: string[];
  deletedVariant: string;
  deletedVariantItems: string[];
}

async function handler(request: NextRequest) {
  const body: IProductUpdateRequestBody = await request.json();
  const secret = request.headers.get("secret");

  const { deletedVariant, deletedVariantItems, ...productData } = body;

  if (secret === process.env.NEXT_PUBLIC_SELLER_TOKEN!) {
    try {
      const products = new Product(
        db.product,
        db.product_variant,
        db.product_variant_item
      );
      const updateProduct = await products.updateProduct(productData);

      if (body.variant) {
        await products.productVariantUpdate(productData);
      }

      if (body.deletedVariantItems && body.deletedVariantItems.length > 0) {
        for (const id of body.deletedVariantItems) {
          await products.deleteProductVariantItems(id);
        }
      }

      if (body.deletedVariant) {
        await products.deleteProductVariant(deletedVariant);
      }

      if (updateProduct) {
        revalidateTag("product-detail");
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
  } else {
    return NextResponse.json({
      ok: false,
      message: "Anda tidak mempunyai akses untuk melakukan permintaan ini!",
    });
  }
}

export { handler as PATCH };
