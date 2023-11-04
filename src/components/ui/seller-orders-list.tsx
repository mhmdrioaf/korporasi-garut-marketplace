"use client";

import { ORDER_STATUS } from "@/lib/globals";
import {
  getDateString,
  orderStatusConverter,
  phoneNumberGenerator,
  rupiahConverter,
} from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Separator } from "./separator";
import { Button } from "./button";
import OrderDeliveryReceipt from "./order-delivery-receipt";
import { useOrderManagement } from "@/lib/hooks/context/useOrderManagement";

export default function SellerOrderList() {
  const { orders, renderer } = useOrderManagement();

  const orderShownButtonStyle = (isActive: boolean, isLoading: boolean) => {
    const defaultStyle =
      "w-fit px-4 py-2 rounded-md text-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer select-none shrink-0";
    const activeStyle = " bg-primary text-primary-foreground";
    const loadingStyle =
      "w-fit px-4 py-2 rounded-md bg-input animate-pulse text-transparent";

    return isActive && !isLoading
      ? defaultStyle + activeStyle
      : !isActive && !isLoading
      ? defaultStyle
      : loadingStyle;
  };

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
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-row items-center justify-between gap-2 overflow-x-auto">
        {orders.shown.list.map((value) => (
          <div
            key={value}
            className={orderShownButtonStyle(
              orders.shown.active === value,
              false
            )}
            onClick={() => orders.shown.handler.onOrderShownChanges(value)}
          >
            {orders.shown.labels(value)}
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-4 text-sm">
        {orders.data.length > 0 ? (
          orders.data.map((order) => (
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
                    <p>{order.address?.recipient_name}</p>
                    <p className="font-bold">Nomor Telpon Penerima</p>
                    <p>
                      {phoneNumberGenerator(
                        order.address?.recipient_phone_number ?? ""
                      )}
                    </p>
                    <p className="font-bold">Alamat Lengkap Pengiriman</p>
                    <p>{order.address?.full_address}</p>
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
                    href={ROUTES.PRODUCT.DETAIL(
                      orderItem.product.id.toString()
                    )}
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

      <OrderDeliveryReceipt />
    </div>
  );
}
