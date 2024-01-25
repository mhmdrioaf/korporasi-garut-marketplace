import { db } from "@/lib/db";
import { TAddress, TProduct, TProductVariantItem } from "@/lib/globals";
import { customerOrderIdGenerator } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface IOrderCreateBody {
  user_id: string;
  product: TProduct;
  product_quantity: number;
  product_variant: TProductVariantItem | null;
  shipping_address: TAddress;
  shipping_cost: number;
  total_price: number;
  isPreorder: boolean;
  eta: number;
}

async function handler(request: NextRequest) {
  const body: IOrderCreateBody = await request.json();
  try {
    const maxId = await db.orders.aggregate({
      where: {
        user_id: {
          equals: parseInt(body.user_id),
        },
      },
      _max: {
        order_id: true,
      },
    });

    const orderMaxId = maxId._max.order_id;
    const currentMaxId = Number(
      orderMaxId?.slice(orderMaxId.length - 3, orderMaxId.length) ?? 0
    );
    const newOrderId = customerOrderIdGenerator(currentMaxId + 1);

    const createOrder = await db.orders.create({
      data: {
        order_id: newOrderId,
        user_id: parseInt(body.user_id),
        total_price: body.total_price,
        shipping_address: body.shipping_address.address_id,
        shipping_cost: body.shipping_cost,
        order_type: body.isPreorder ? "PREORDER" : "NORMAL",
        eta: body.isPreorder ? body.eta + 7 : body.eta,
        order_item: {
          create: {
            order_quantity: body.product_quantity,
            product_id: body.product.id,
            product_variant_id: body.product_variant?.variant_item_id ?? null,
          },
        },
      },
    });

    if (createOrder) {
      if (body.product_variant) {
        await db.product_variant_item.update({
          where: {
            variant_item_id: body.product_variant.variant_item_id,
          },
          data: {
            pending_order_count: {
              increment: body.product_quantity,
            },
          },
        });
      }
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false });
  }
}

export { handler as POST };
