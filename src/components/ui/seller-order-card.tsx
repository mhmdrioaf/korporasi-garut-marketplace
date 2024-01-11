"use client";

import { ORDER_STATUS, TSellerOrder } from "@/lib/globals";
import {
  getDateString,
  getOrderType,
  orderStatusConverter,
  phoneNumberGenerator,
  rupiahConverter,
} from "@/lib/helper";
import { useOrderManagement } from "@/lib/hooks/context/useOrderManagement";
import { Button } from "./button";
import Link from "next/link";
import { Separator } from "./separator";
import Image from "next/image";
import { ROUTES } from "@/lib/constants";

interface ISellerOrderCardProps {
  ordersData: TSellerOrder[];
}

export default function SellerOrderCard({ ordersData }: ISellerOrderCardProps) {
  const { renderer } = useOrderManagement();

  const showPaymentProofButton = (
    orderStatus: ORDER_STATUS,
    paymentProof: string | null
  ) => {
    if (paymentProof && orderStatus !== "PENDING") {
      return (
        <Button variant="ghost" asChild>
          <Link href={paymentProof} target="_blank">
            Bukti Pembayaran
          </Link>
        </Button>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 text-sm mb-16">
      {ordersData.length > 0 ? (
        ordersData.map((order) => (
          <div
            key={order.order_id}
            className="w-full flex flex-col gap-2 rounded-md border border-input px-4 py-2"
          >
            <div className="w-full flex flex-col gap-2">
              <div className="grid grid-cols-3 mb-2">
                <div className="col-span-2 flex flex-col gap-2">
                  <p className="font-bold text-lg">Detail Pesanan</p>
                  <div className="grid grid-cols-2">
                    <p className="font-bold">ID Pesanan</p>
                    <p>{order.order_id}</p>
                    <p className="font-bold">Tanggal Pesanan</p>
                    <p>{getDateString(order.order_date)}</p>
                    <p className="font-bold">Dipesan Oleh</p>
                    <p>{order.user.account?.user_name}</p>
                    <p className="font-bold">Tipe Pesanan</p>
                    <p>{getOrderType(order.order_type)}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 justify-self-end self-center">
                  <p className="font-bold">
                    Status Pesanan: {orderStatusConverter(order.order_status)}
                  </p>
                  <p className="font-bold">
                    Total Harga: {rupiahConverter(order.total_price)}
                  </p>
                  {renderer.actionButton(order)}
                  {showPaymentProofButton(
                    order.order_status,
                    order.payment_proof
                  )}
                </div>
              </div>
              <Separator />
              <p className="font-bold text-lg">Detail Pengiriman</p>
              <div className="grid grid-cols-3 mb-2">
                <div className="col-span-2 grid grid-cols-2">
                  <p className="font-bold">Nama Penerima</p>
                  <p>
                    {order.address?.recipient_name ?? "Detail alamat di hapus"}
                  </p>
                  <p className="font-bold">Nomor Telpon Penerima</p>
                  <p>
                    {order.address
                      ? phoneNumberGenerator(
                          order.address.recipient_phone_number
                        )
                      : "Detail alamat di hapus"}
                  </p>
                  <p className="font-bold">Alamat Lengkap Pengiriman</p>
                  <p>
                    {order.address?.full_address ?? "Detail alamat di hapus"}
                  </p>
                  <p className="font-bold">Ongkos Kirim</p>
                  <p>{rupiahConverter(order.shipping_cost)}</p>
                </div>
              </div>
            </div>

            {order.order_item.map((orderItem) => (
              <div
                className="w-full rounded-sm overflow-hidden p-2 grid grid-cols-3 gap-4 border border-input"
                key={`${order.order_id} - ${
                  orderItem.variant
                    ? orderItem.variant.variant_item_id
                    : orderItem.product.id
                }`}
              >
                <div className="flex flex-row items-center gap-2">
                  <div className="w-14 h-14 rounded-sm overflow-hidden relative">
                    <Image
                      src={orderItem.product.images[0]}
                      alt="product image"
                      fill
                      className="object-cover"
                      sizes="100vw"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">
                      {orderItem.product.title}
                      {orderItem.variant
                        ? ` - ${orderItem.variant.variant_name}`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-sm">
                  <p>Harga Produk</p>
                  <p>
                    {rupiahConverter(
                      orderItem.variant
                        ? orderItem.variant.variant_price
                        : orderItem.product.price
                    )}
                  </p>
                  <p>Jumlah Pesanan</p>
                  <p>
                    {orderItem.order_quantity} {orderItem.product.unit}
                  </p>
                  <p className="font-bold">Total Harga</p>
                  <p className="font-bold">
                    {rupiahConverter(
                      orderItem.variant
                        ? orderItem.variant.variant_price *
                            orderItem.order_quantity
                        : orderItem.product.price * orderItem.order_quantity
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
        ))
      ) : (
        <div className="w-full text-center text-sm">
          <p>Tidak ada pesanan dalam status ini.</p>
        </div>
      )}
    </div>
  );
}
