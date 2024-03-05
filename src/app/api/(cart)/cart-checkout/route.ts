import { db } from "@/lib/db";
import { customerOrderIdGenerator } from "@/lib/helper";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface ICartCheckoutBody {
  items: TCustomerCartItem[];
  total_price: number;
  total_shipping_cost: number;
  customer_id: string;
  shipping_address: string;
  isPreorder: boolean;
  eta: number;
  isSameday: boolean;
  shipping_service: string;
}

async function handler(request: NextRequest) {
  const body: ICartCheckoutBody = await request.json();
  const cookiesList = cookies();
  const referrer = cookiesList.get("marketplace.referral");

  try {
    const maxId = await db.orders.aggregate({
      where: {
        user_id: {
          equals: parseInt(body.customer_id),
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

    const createManyOrderItems = body.items.map((item) => ({
      order_quantity: item.quantity,
      product_id: item.product_id,
      product_variant_id: item.product_variant_item_id,
    }));

    const newOrder = await db.orders.create({
      data: {
        order_id: newOrderId,
        shipping_cost: body.total_shipping_cost,
        total_price: body.total_price,
        eta: body.eta,
        isSameday: body.isSameday,
        order_item: {
          createMany: {
            data: createManyOrderItems,
          },
        },
        user_id: parseInt(body.customer_id),
        shipping_address: body.shipping_address,
        order_type: body.isPreorder ? "PREORDER" : "NORMAL",
        shipping_service: body.shipping_service,
      },
    });

    if (newOrder) {
      const generateIncomes = await db.income.create({
        data: {
          order_id: newOrder.order_id,
          total_income: body.total_price - body.total_shipping_cost,
          seller_id: referrer ? null : body.items[0].product.seller_id,
          referrer_id: referrer ? referrer.value : null,
        },
      });

      if (generateIncomes) {
        if (referrer) {
          cookiesList.delete("marketplace.referral");
        }
      }
      return NextResponse.json({
        ok: true,
        message:
          "Pesanan berhasil dibuat, silahkan cek halaman pesanan untuk membayar.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message:
          "Terjadi kesalahan ketika membuat pesanan, silahkan coba lagi nanti; hubungi developer jika masalah berlanjut.",
      });
    }
  } catch (error) {
    console.error("Terjadi kesalahan ketika membuat pesanan: ", error);
    return NextResponse.json({
      ok: false,
      message:
        "Terjadi kesalahan ketika membuat pesanan, silahkan coba lagi nanti; hubungi developer jika masalah berlanjut.",
    });
  }
}

export { handler as POST };
