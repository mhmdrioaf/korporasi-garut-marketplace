"use client";

import { ORDER_STATUS, TSellerOrder } from "@/lib/globals";
import { Container } from "./container";
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
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import OrderDeliveryReceipt from "./order-delivery-receipt";

interface ISellerOrderListProps {
  orders: TSellerOrder[];
  seller_token: string;
}

type TOrderShown = "ALL" | ORDER_STATUS;

export default function SellerOrderList({
  orders,
  seller_token,
}: ISellerOrderListProps) {
  const [updating, setUpdating] = useState(false);
  const [deliveryReceipt, setDeliveryReceipt] = useState(false);
  const [orderShown, setOrderShown] = useState<TOrderShown | "ALL">("ALL");

  const router = useRouter();
  const { toast } = useToast();

  const changeOrderStatus = async (
    order_status: ORDER_STATUS | null,
    order_id: string,
    delivery_receipt: string | null
  ) => {
    setUpdating(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_ORDER_UPDATE_STATUS!, {
      method: "PATCH",
      headers: {
        token: seller_token,
      },
      body: JSON.stringify({
        order_id: order_id,
        order_status: order_status,
        delivery_receipt: delivery_receipt,
      }),
    });

    const response = await res.json();

    if (!response.ok) {
      setUpdating(false);
      toast({
        variant: "destructive",
        title: "Gagal mengubah status pesanan",
        description: response.message,
      });
    } else {
      setUpdating(false);
      toast({
        variant: "success",
        title: "Berhasil mengubah status pesanan",
        description: response.message,
      });
      router.refresh();
    }
  };

  const showActionButton = (
    order_status: ORDER_STATUS,
    order_id: string,
    delivery_receipt: string | null
  ) => {
    let buttonTitle: string | null = null;
    let orderStatus: ORDER_STATUS | null = null;
    switch (order_status) {
      case "PAID":
        buttonTitle = "Kemas Pesanan";
        orderStatus = "PACKED";
        break;
      case "PACKED":
        buttonTitle = "Kirim Pesanan";
        orderStatus = "SHIPPED";
        break;
      case "SHIPPED":
        if (delivery_receipt) {
          buttonTitle = "Ubah Resi";
        } else {
          buttonTitle = "Kirim Resi Pengiriman";
        }
        orderStatus = "SHIPPED";
        break;
      default:
        buttonTitle = null;
        orderStatus = null;
        setDeliveryReceipt(false);
        break;
    }
    return buttonTitle && orderStatus ? (
      <Button
        variant="default"
        onClick={
          orderStatus !== "SHIPPED"
            ? () => changeOrderStatus(orderStatus, order_id, null)
            : () => setDeliveryReceipt(true)
        }
        disabled={updating}
      >
        {updating ? (
          <>
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            <span>Mengubah status...</span>
          </>
        ) : (
          <span>{buttonTitle}</span>
        )}
      </Button>
    ) : null;
  };

  const conditionalOrders = () => {
    let orderToShown = orders;
    switch (orderShown) {
      case "ALL":
        return orderToShown;
      default:
        orderToShown = orders.filter(
          (order) => order.order_status === orderShown
        );
        return orderToShown;
    }
  };

  const onModalClose = () => {
    setDeliveryReceipt(false);
    setUpdating(false);
  };

  const onOrderShownChanges = (options: TOrderShown) => {
    setOrderShown(options);
  };

  const orderShownList: TOrderShown[] = [
    "ALL",
    "PENDING",
    "PAID",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "FINISHED",
  ];
  const orderShownLabels = (order_status: TOrderShown) => {
    switch (order_status) {
      case "ALL":
        return "Semua";
      case "PENDING":
        return "Menunggu Pembayaran";
      case "PAID":
        return "Menunggu Pengiriman";
      case "PACKED":
        return "Dikemas";
      case "SHIPPED":
        return "Sedang Dikirim";
      case "DELIVERED":
        return "Diterima";
      case "FINISHED":
        return "Selesai";
      default:
        return "Semua";
    }
  };
  const orderShownButtonStyle = (isActive: boolean) => {
    const defaultStyle =
      "w-fit px-4 py-2 rounded-md text-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer select-none shrink-0";
    const activeStyle = " bg-primary text-primary-foreground";

    return isActive ? defaultStyle + activeStyle : defaultStyle;
  };

  return (
    <Container variant="column">
      <div className="flex flex-col gap-2">
        <p className="text-2xl text-primary font-bold">Daftar pesanan datang</p>
        <p className="text-sm">
          Berikut merupakan daftar pesanan yang datang untuk produk yang telah
          anda unggah.
        </p>
      </div>

      <div className="w-full flex flex-row items-center justify-between gap-2 overflow-x-auto">
        {orderShownList.map((value) => (
          <div
            key={value}
            className={orderShownButtonStyle(orderShown === value)}
            onClick={() => onOrderShownChanges(value)}
          >
            {orderShownLabels(value)}
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-4 text-sm">
        {conditionalOrders().length > 0 ? (
          conditionalOrders().map((order) => (
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
                    {showActionButton(
                      order.order_status,
                      order.order_id,
                      order.delivery_receipt
                    )}
                    <OrderDeliveryReceipt
                      isLoading={updating}
                      isOpen={deliveryReceipt}
                      onClose={onModalClose}
                      orderStatusChanger={changeOrderStatus}
                      order_detail={{
                        order_id: order.order_id,
                        order_status: "SHIPPED",
                      }}
                      defaultValue={order.delivery_receipt}
                    />
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
                  key={orderItem.product.id}
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
    </Container>
  );
}