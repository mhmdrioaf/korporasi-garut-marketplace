import { db } from "@/lib/db";
import { TSellerOrder } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

interface IListSellerOrdersBody {
  seller_id: string;
}

async function handler(request: NextRequest) {
  const body: IListSellerOrdersBody = await request.json();
  const token = request.headers.get("token");

  if (token && token === process.env.NEXT_PUBLIC_SELLER_TOKEN!) {
    try {
      const sellerOrders: TSellerOrder[] = await db.orders.findMany({
        where: {
          order_item: {
            every: {
              product: {
                seller_id: {
                  equals: parseInt(body.seller_id),
                },
              },
            },
          },
        },
        include: {
          order_item: {
            select: {
              order_quantity: true,
              product: {
                select: {
                  title: true,
                  capable_out_of_town: true,
                  images: true,
                  id: true,
                  price: true,
                  stock: true,
                  storage_period: true,
                  expire_date: true,
                  unit: true,
                },
              },
              variant: true,
            },
          },
          address: {
            include: {
              city: true,
            },
          },
          user: {
            select: {
              account: true,
            },
          },
        },
      });

      if (sellerOrders) {
        return NextResponse.json({ ok: true, result: sellerOrders });
      } else {
        return NextResponse.json({ ok: false, result: null });
      }
    } catch (error) {
      console.error(
        "An error occurred when listing the seller orders: ",
        error
      );
      return NextResponse.json({ ok: false, result: null });
    }
  } else {
    return NextResponse.json({
      ok: false,
      message: "You have no access to make this request!",
    });
  }
}

export { handler as POST };
