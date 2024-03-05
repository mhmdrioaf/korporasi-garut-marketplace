import { db } from "@/lib/db";
import { customerOrderIdGenerator, properizeWords } from "@/lib/helper";
import { cookies } from "next/headers";
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
  isSameday: boolean;
  service: string;
}

async function handler(request: NextRequest) {
  const body: IOrderCreateBody = await request.json();
  const cookiesList = cookies();
  const referrer = cookiesList.get("marketplace.referral");

  const eta = () => {
    if (body.isPreorder) {
      return body.eta + 7;
    } else if (body.isSameday) {
      return 1;
    } else {
      return body.eta;
    }
  };

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
        shipping_service: body.service,
        eta: eta(),
        isSameday: body.isSameday,
        order_item: {
          create: {
            order_quantity: body.product_quantity,
            product_id: body.product.id,
            product_variant_id: body.product_variant?.variant_item_id ?? null,
          },
        },
        income: {
          create: {
            total_income: body.total_price - body.shipping_cost,
            seller_id: referrer ? null : body.product.seller_id,
            referrer_id: referrer ? referrer.value : null,
          },
        },
      },
    });

    if (createOrder) {
      cookiesList.delete("marketplace.referral");
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
