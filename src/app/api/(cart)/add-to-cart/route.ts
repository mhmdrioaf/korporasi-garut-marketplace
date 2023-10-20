import { db } from "@/lib/db";
import { TProduct, TProductVariantItem } from "@/lib/globals";
import Carts from "@/lib/prisma-classes/Carts";
import { NextRequest, NextResponse } from "next/server";

interface IAddToCartRequestBody {
  user_id: string;
  product: TProduct;
  product_variant: TProductVariantItem | null;
  product_quantity: number;
}

async function handler(request: NextRequest) {
  const body: IAddToCartRequestBody = await request.json();

  try {
    const carts = new Carts(db.customer_cart, db.customer_cart_item);
    const addNewCart = await carts.initializeCart(body);

    return NextResponse.json(addNewCart);
  } catch (error) {
    console.error("An error occurred while adding items to the cart: ", error);
    return NextResponse.json({
      ok: false,
      message:
        "Telah terjadi kesalahan pada server, silahkan coba lagi nanti; hubungi developer jika masalah berlanjut.",
    });
  }
}

export { handler as PUT };
