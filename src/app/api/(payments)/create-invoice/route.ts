import { TOrder } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";
import Xendit from "xendit-node";

interface ICreateInvoiceBody {
  order: TOrder;
}

async function handler(request: NextRequest) {
  const body: ICreateInvoiceBody = await request.json();

  try {
    const xendit = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY!,
    });

    const resp = await xendit.Invoice.createInvoice({
      data: {
        externalId: body.order.order_id,
        amount: body.order.total_price,
        currency: "IDR",
        description: `Pembayaran untuk pesanan anda di SMKs Korporasi Garut Marketplace, dengan nomor pesanan ${body.order.order_id}. Untuk detail harga dan produk, silahkan cek di halaman pesanan.`,
        items: body.order.order_item.map((item) => ({
          name: item.variant
            ? `${item.product.title} - ${item.variant.variant_name}`
            : item.product.title,
          price: item.variant ? item.variant.variant_price : item.product.price,
          quantity: item.order_quantity,
        })),
        customer: {
          givenNames: body.order.address.recipient_name,
          email: body.order.user.email,
          phoneNumber: body.order.address.recipient_phone_number,
        },
        customerNotificationPreference: {
          invoiceCreated: ["whatsapp"],
          invoiceReminder: ["whatsapp"],
          invoicePaid: ["whatsapp"],
          invoiceExpired: ["whatsapp"],
        },
        paymentMethods: [
          "BCA",
          "BNI",
          "BRI",
          "ALFAMART",
          "INDOMARET",
          "DANA",
          "QRIS",
        ],
        successRedirectUrl:
          process.env.NEXT_PUBLIC_API_PAYMENT_SUCCESS! +
          `?id=${body.order.order_id}`,
        local: "id",
      },
    });

    if (resp) {
      return NextResponse.json({
        ok: true,
        message:
          "Berhasil membuat invoice, mengalihkan ke halaman pembayaran...",
        invoice_url: resp.invoiceUrl,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan ketika membuat invoice.",
    });
  }
}

export { handler as POST };
