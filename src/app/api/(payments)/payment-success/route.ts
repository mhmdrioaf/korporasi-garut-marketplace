import {
  sendNotificationHandler,
  sendSellerNotificationHandler,
} from "@/lib/actions/notification";
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
            order_quantity: true,
            product: {
              select: {
                seller_id: true,
                id: true,
              },
            },
            variant: true,
          },
        },
      },
    });

    if (productOrder && productOrder.order_status === "PENDING") {
      const updateOrderStatus = db.orders.update({
        where: {
          order_id: orderID,
        },
        data: {
          order_status: "PAID",
        },
      });

      const sendCustomerNotification = sendNotificationHandler({
        subscriber_target: productOrder.user_id.toString(),
        notification_title: `Pesanan dengan ID ${orderID} berhasil dibayar dan sedang menunggu pengiriman.`,
        notification_redirect_url: "/user/dashboard/orders?state=PAID",
      });

      const sendSellerNotification = sendSellerNotificationHandler({
        seller_id: productOrder.order_item[0].product.seller_id.toString(),
        order_id: orderID,
      });

      if (productOrder.order_type === "NORMAL") {
        for (const item of productOrder.order_item) {
          if (item.variant) {
            await db.product.update({
              where: {
                id: item.product.id,
              },
              data: {
                stock: {
                  decrement: item.order_quantity,
                },
                variant: {
                  update: {
                    variant_item: {
                      update: {
                        where: {
                          variant_item_id: item.variant.variant_item_id,
                        },
                        data: {
                          variant_stock: {
                            decrement: item.order_quantity,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });
          }
          await db.product.update({
            where: {
              id: item.product.id,
            },
            data: {
              stock: {
                decrement: item.order_quantity,
              },
            },
          });
        }
      }

      await Promise.all([
        updateOrderStatus,
        sendCustomerNotification,
        sendSellerNotification,
      ]).then(() => redirect(ROUTES.USER.ORDERS));
    } else {
      return redirect(ROUTES.USER.ORDERS);
    }
  }
}

export { handler as GET };
