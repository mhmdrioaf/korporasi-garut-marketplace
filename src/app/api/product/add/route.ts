import { db } from "@/lib/db";
import Product from "@/lib/prisma-classes/Product";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type TProductVariantInput = {
  variant_title: string;
};

type TProductVariantItemInput = {
  variant_name: string;
  variant_value: string;
  variant_price: number;
};

interface IProductRequestBody {
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

// TODO: Add user validation via token

async function handler(request: NextRequest) {
  const body: IProductRequestBody = await request.json();
  try {
    const products = new Product(
      db.product,
      db.product_variant,
      db.product_variant_item
    );
    const newProduct = await products.addProduct(body);

    if (newProduct) {
      return NextResponse.json({
        ok: true,
        message: "Produk baru telah ditambahkan ke katalog produk anda.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message:
          "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
    });
  }
}

export { handler as PUT };
