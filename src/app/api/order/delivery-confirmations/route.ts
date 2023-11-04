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
    });

    if (updateOrderStatus) {
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
