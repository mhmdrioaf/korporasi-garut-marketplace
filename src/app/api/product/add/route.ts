import { db } from "@/lib/db";
import { IProductInput } from "@/lib/hooks/context/productContextType";
import Product from "@/lib/prisma-classes/Product";
import { NextRequest, NextResponse } from "next/server";

interface IProductRequestBody extends IProductInput {
  id: string;
  tags: string[];
}

async function handler(request: NextRequest) {
  const body: IProductRequestBody = await request.json();
  const headers = request.headers;
  const secret = headers.get("secret") || "";

  if (
    secret === process.env.NEXT_PUBLIC_SELLER_TOKEN ||
    secret === process.env.NEXT_PUBLIC_ADMIN_TOKEN
  ) {
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
        message:
          "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
      });
    }
  } else {
    return NextResponse.json({
      ok: false,
      message: "Anda tidak mempunyai akses untuk melakukan permintaan ini.",
    });
  }
}

export { handler as PUT };
