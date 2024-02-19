import { sendNotificationHandler } from "@/lib/actions/notification";
import { db } from "@/lib/db";
import { permissionHelper } from "@/lib/helper";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

interface IUpdateStatusBody {
  order_id: string;
  order_status: ORDER_STATUS | null;
  order_items: Pick<TOrder, "order_item">;
  delivery_receipt: string | null;
}

async function handler(request: NextRequest) {
  const body: IUpdateStatusBody = await request.json();
  const token = request.headers.get("token");

  const notificationDetail = () => {
    if (body.order_status === "SHIPPED") {
      return {
        message: `Pesanan dengan ID ${body.order_id} telah dikirim.`,
        redirect_url: "/user/dashboard/orders?state=SHIPPED",
      };
    } else if (body.order_status === "PACKED") {
      return {
        message: `Pesanan dengan ID ${body.order_id} sedang dikemas.`,
        redirect_url: "/user/dashboard/orders?state=PACKED",
      };
    }
  };

  if (
    token &&
    permissionHelper(token, process.env.NEXT_PUBLIC_SELLER_TOKEN!.toString())
  ) {
    if (body.order_status) {
      try {
        const updateOrderStatus = await db.orders.update({
          where: {
            order_id: body.order_id,
          },
          data: {
            order_status: body.order_status,
            delivery_receipt: body.delivery_receipt,
          },
          include: {
            order_item: {
              select: {
                product: {
                  select: {
                    seller_id: true,
                  },
                },
              },
            },
          },
        });

        if (updateOrderStatus) {
          const _notificationDetail = notificationDetail();
          if (_notificationDetail) {
            await sendNotificationHandler({
              notification_redirect_url: _notificationDetail.redirect_url,
              notification_title: _notificationDetail.message,
              subscriber_target: updateOrderStatus.user_id.toString(),
            });
          }
          revalidateTag("seller-orders");
          return NextResponse.json({
            ok: true,
            message: "Berhasil mengubah status pesanan.",
          });
        } else {
          return NextResponse.json({
            ok: false,
            message: "Telah terjadi kesalahan ketika mengubah status pesanan.",
          });
        }
      } catch (error) {
        console.error("An error occurred when updating order status: ", error);
        return NextResponse.json({
          ok: false,
          message: "Telah terjadi kesalahan ketika mengubah status pesanan.",
        });
      }
    } else {
      return NextResponse.json({
        ok: false,
        message:
          "Telah terjadi kesalahan ketika mengubah status pesanan, status pesanan tidak disediakan.",
      });
    }
  } else {
    return NextResponse.json({
      ok: false,
      message: "Anda tidak mempunyai akses untuk melakukan permintaan ini.",
    });
  }
}

export { handler as PATCH };
