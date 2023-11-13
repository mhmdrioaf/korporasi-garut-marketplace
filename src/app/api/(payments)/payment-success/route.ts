import { sendNotificationHandler, sendSellerNotificationHandler } from "@/lib/actions/notification";
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
      include: {
        order_item: {
          select: {
            product: {
              select: {
                seller_id: true
              }
            }
          }
        }
      }
    });

    if (productOrder) {
      const updateOrderStatus = db.orders.update({
        where: {
          order_id: orderID
        },
        data: {
          order_status: "PAID"
        }
      });

      const sendCustomerNotification = sendNotificationHandler({
        subscriber_target: productOrder.user_id.toString(),
        notification_title: `Pesanan dengan ID ${orderID} berhasil dibayar dan sedang menunggu pengiriman.`,
        notification_redirect_url: "/user/dashboard/orders?state=PAID"
      });

      const sendSellerNotification = sendSellerNotificationHandler({
        seller_id: productOrder.order_item[0].product.seller_id.toString(),
        order_id: orderID,
      });

      await Promise.all([updateOrderStatus, sendCustomerNotification, sendSellerNotification]).then(() => redirect(ROUTES.USER.ORDERS));
    }
  }
}

export { handler as GET };
