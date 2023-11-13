import { sendNotificationHandler } from "@/lib/actions/notification";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface IDeliveryConfirmationsBody {
  order_id: string;
}

async function handler(request: NextRequest) {
  const body: IDeliveryConfirmationsBody = await request.json();
  const date = new Date();

  try {
    const updateOrderStatus = await db.orders.update({
      where: {
        order_id: body.order_id,
      },
      data: {
        order_status: "DELIVERED",
        order_delivered_date: date,
      },
      include: {
        order_item: {
          select: {
            product: {
              select: {
                seller_id: true,
              },
            },
          }
        }
      }
    });

    if (updateOrderStatus) {
      await sendNotificationHandler({
        notification_redirect_url: "/user/dashboard/seller-orders?state=DELIVERED",
        notification_title: `Pesanan dengan ID ${body.order_id} telah diterima oleh pelanggan.`,
        subscriber_target: updateOrderStatus.order_item[0].product.seller_id.toString(),
      })
      
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengkonfimasi penerimaan pesanan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message:
          "Terjadi kesalahan ketika mengubah status pesanan, silahakn coba lagi nanti.",
      });
    }
  } catch (error) {
    console.error(
      "An error occurred when updating order delivery status: ",
      error
    );
    return NextResponse.json({
      ok: false,
      message:
        "Terjadi kesalahan ketika mengubah status pesanan, silahakn coba lagi nanti.",
    });
  }
}

export { handler as POST };
