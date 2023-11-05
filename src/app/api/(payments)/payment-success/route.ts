import { ROUTES } from "@/lib/constants";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

async function handler(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderID = searchParams.get("id");

  if (orderID) {
    const productOrder = await db.orders.findUnique({
      where: {
        order_id: orderID,
      },
    });

    if (productOrder) {
      await db.orders
        .update({
          where: {
            order_id: orderID,
          },
          data: {
            order_status: "PAID",
          },
        })
        .then(() => redirect(ROUTES.USER.ORDERS));
    }
  }
}

export { handler as GET };
