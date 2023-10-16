"use client";

import { TCustomerOrder } from "@/lib/globals";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import {
  getDateString,
  getTotalAmount,
  orderStatusConverter,
  rupiahConverter,
} from "@/lib/helper";
import ShowOrderButton from "@/lib/renderer/order-button";
import { useToast } from "./use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IOrderCardProps {
  order: TCustomerOrder;
}

export default function OrderCard({ order }: IOrderCardProps) {
  const [buttonLoading, setButtonLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const onPaymentClick = async (order: TCustomerOrder) => {
    setButtonLoading(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_CREATE_INVOICE!, {
      method: "POST",
      body: JSON.stringify({
        order: order,
      }),
    });

    const response = await res.json();
    if (!response.ok) {
      setButtonLoading(false);
      toast({
        variant: "destructive",
        title: "Gagal membuat invoice",
        description: response.message,
      });
    } else {
      setButtonLoading(false);
      toast({
        variant: "success",
        title: "Berhasil membuat invoice",
        description: response.message,
      });
      if (response.invoice_url) {
        router.push(response.invoice_url);
      }
    }
  };
  return (
    <div className="w-full rounded-sm overflow-hidden flex flex-col gap-2 lg:gap-4 p-2 border border-input">
      <div className="w-full flex flex-row items-start justify-between">
        <div className="w-fit grid grid-cols-2 gap-2">
          <p className="font-bold">ID Pesanan</p>
          <p>{order.order_id}</p>
          <p className="font-bold">Tanggal Pesanan</p>
          <p>{getDateString(order.order_date)}</p>
          <p className="font-bold">Alamat Pengiriman</p>
          <p className="max-w-[16ch]">{order.address.full_address}</p>
        </div>

        <div className="w-fit flex flex-col gap-2">
          <p className="font-bold">
            Status Pesanan: {orderStatusConverter(order.order_status)}
          </p>
          <ShowOrderButton
            status={order.order_status}
            onPaymentClick={() => onPaymentClick(order)}
            disabled={buttonLoading}
          />
        </div>
      </div>

      {order.order_item.map((orderItem) => (
        <div
          className="w-full rounded-sm overflow-hidden p-2 grid grid-cols-3 gap-4 border border-input"
          key={orderItem.product.id}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="w-14 h-14 rounded-sm overflow-hidden relative">
              <Image
                src={orderItem.product.images[0]}
                alt="product image"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">{orderItem.product.title}</p>
              <p className="text-sm">
                {orderItem.product.seller.account.user_name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1 text-sm">
            <p>Harga Produk</p>
            <p>{rupiahConverter(orderItem.product.price)}</p>
            <p>Jumlah Pesanan</p>
            <p>
              {orderItem.order_quantity} {orderItem.product.unit}
            </p>
            {orderItem.variant && orderItem.variant.variant_price > 0 && (
              <>
                <p>Harga Varian Produk</p>
                <p>
                  {rupiahConverter(orderItem.variant.variant_price)}/
                  {orderItem.product.unit}
                </p>
              </>
            )}
            <p className="font-bold">Total Harga</p>
            <p className="font-bold">
              {rupiahConverter(
                getTotalAmount(
                  orderItem.product.price,
                  orderItem.order_quantity,
                  orderItem.variant?.variant_price ?? null
                )
              )}
            </p>
          </div>

          <Link
            href={ROUTES.PRODUCT.DETAIL(orderItem.product.id.toString())}
            className="font-bold text-primary self-center place-self-end"
          >
            Lihat Produk
          </Link>
        </div>
      ))}
    </div>
  );
}
