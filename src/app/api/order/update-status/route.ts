import { db } from "@/lib/db";
import { ORDER_STATUS } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

interface IUpdateStatusBody {
  order_id: string;
  order_status: ORDER_STATUS | null;
  delivery_receipt: string | null;
}

async function handler(request: NextRequest) {
  const body: IUpdateStatusBody = await request.json();
  const token = request.headers.get("token");

  if (token && token === process.env.NEXT_PUBLIC_SELLER_TOKEN!) {
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
        });

        if (updateOrderStatus) {
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