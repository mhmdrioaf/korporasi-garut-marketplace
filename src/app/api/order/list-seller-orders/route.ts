import { db } from "@/lib/db";
import { permissionHelper } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const headers = request.headers;
  const token = headers.get("token");
  const seller_id = headers.get("id");

  if (
    token &&
    permissionHelper(token, process.env.NEXT_PUBLIC_SELLER_TOKEN!.toString()) &&
    seller_id
  ) {
    try {
      const sellerOrders = await db.orders.findMany({
        where: {
          order_item: {
            every: {
              product: {
                seller_id: {
                  equals: parseInt(seller_id),
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
        orderBy: {
          order_date: "desc",
        },
      });

      if (sellerOrders) {
        return NextResponse.json({
          ok: true,
          result: sellerOrders,
          message: "Seller order has been succesfully listed.",
        });
      } else {
        return NextResponse.json({
          ok: false,
          result: null,
          message: "No seller order listed",
        });
      }
    } catch (error) {
      console.error(
        "An error occurred when listing the seller orders: ",
        error
      );
      return NextResponse.json({
        ok: false,
        result: null,
        message: "An error occurred when listing the seller orders.",
      });
    }
  } else {
    return NextResponse.json({
      ok: false,
      result: null,
      message: "You have no access to make this request!",
    });
  }
}

export { handler as GET };
