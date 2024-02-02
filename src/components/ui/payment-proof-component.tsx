"use client";

import { Invoice } from "xendit-node/invoice/models";
import { Button } from "./button";
import Link from "next/link";
import { rupiahConverter } from "@/lib/helper";

interface IPaymentProofProps {
  invoice: Invoice;
}

export default function PaymentProofComponent({ invoice }: IPaymentProofProps) {
  const title =
    invoice.status === "PENDING"
      ? "Detail Pembayaran"
      : invoice.status === "PAID"
        ? "Bukti Pembayaran"
        : "Detail Pembayaran";
  const description = () => {
    const onPaid =
      "Berikut merupakan data bukti pembayaran terhadap pesanan yang anda lakukan";
    const onPending =
      "Berikut merupakan data pembayaran yang harus segera dilakukan";

    if (invoice.status === "PENDING") {
      return onPending;
    } else if (invoice.status === "PAID") {
      return onPaid;
    } else {
      return onPending;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <p className="font-bold text-2xl text-primary">{title}</p>
        <p className="text-sm">{description()}</p>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="w-full flex flex-col gap-0 text-sm">
          <b>Nomor Pembayaran</b>
          <p>{invoice.id}</p>
        </div>
        <div className="w-full flex flex-col gap-0 text-sm">
          <b>Total Pembayaran</b>
          <p>{rupiahConverter(invoice.amount)}</p>
        </div>
        <div className="w-full flex flex-col gap-0 text-sm">
          <b>Status Pembayaran</b>
          <p>{invoice.status}</p>
        </div>
        <div className="w-full flex flex-col gap-0 text-sm">
          <b>Deskripsi</b>
          <p>{invoice.description}</p>
        </div>

        {invoice.status === "PENDING" && (
          <Button variant="default" asChild>
            <Link href={invoice.invoiceUrl} target="_blank">
              Lanjutkan Pembayaran
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
