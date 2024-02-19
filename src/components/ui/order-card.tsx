"use client";

import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import {
  getDateString,
  getOrderType,
  orderStatusConverter,
  rupiahConverter,
} from "@/lib/helper";
import ShowOrderButton from "@/lib/renderer/order-button";
import { useToast } from "./use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";
import ShippingTracking from "./modals/shipping-tracking";

interface IOrderCardProps {
  ordersData: TOrder[];
}

export default function OrderCard({ ordersData }: IOrderCardProps) {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [deliveryReceipt, setDeliveryReceipt] = useState<string | null>(null);
  const [isSameday, setIsSameday] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const onPaymentClick = async (order: TOrder) => {
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

  const onOrderDelivered = async (order_id: string) => {
    setButtonLoading(true);

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_ORDER_CONFIRMATIONS!,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: order_id,
          }),
        }
      );

      const response = await res.json();

      if (!response.ok) {
        setButtonLoading(false);
        toast({
          variant: "destructive",
          title: "Gagal Mengkonfirmasi Pesanan",
          description: response.message,
        });
      } else {
        setButtonLoading(false);
        toast({
          variant: "success",
          title: "Berhasil Mengkonfirmasi Pesanan",
          description: response.message,
        });
        router.refresh();
      }
    } catch (error) {
      setButtonLoading(false);
      toast({
        variant: "destructive",
        title: "Gagal mengkonfirmasi pesanan.",
        description:
          "Telah terjadi kesalahan ketika mengkonfirmasi pesanan, silahkan coba lagi nanti; hubungi developer jika masalah terus berlanjut.",
      });
      console.error("Error saat menerima pesanan.");
    }
  };

  const showPaymentProof = (
    orderStatus: ORDER_STATUS,
    paymentProof: string | null
  ) => {
    if (paymentProof) {
      if (orderStatus !== "PENDING") {
        if (orderStatus === "DELIVERED" || orderStatus === "FINISHED") {
          return null;
        } else {
          return (
            <Button asChild variant="ghost">
              <Link href={ROUTES.USER.PAYMENT_PROOF(paymentProof ?? "")}>
                Lihat Bukti Pembayaran
              </Link>
            </Button>
          );
        }
      } else {
        return (
          <Button asChild variant="default">
            <Link href={ROUTES.USER.PAYMENT_PROOF(paymentProof ?? "")}>
              Lanjutkan Pembayaran
            </Link>
          </Button>
        );
      }
    } else {
      return null;
    }
  };

  const showDeliveredDate = (delivered_date: Date) => {
    const dateString = getDateString(delivered_date);

    return `Pesanan diterima pada tanggal: ${dateString}`;
  };

  const showOrderDeliveredButton = (
    order_status: ORDER_STATUS,
    order_id: string
  ) => {
    if (order_status === "SHIPPED") {
      return (
        <Button
          variant="default"
          onClick={() => onOrderDelivered(order_id)}
          disabled={buttonLoading}
        >
          {buttonLoading ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              <span>Mengkonfirmasi...</span>
            </>
          ) : (
            "Pesanan Diterima"
          )}
        </Button>
      );
    } else {
      return null;
    }
  };

  const showShippingTrackingModal = (
    receipt: string | null,
    isSameday: boolean
  ) => {
    setDeliveryReceipt(receipt);
    setIsSameday(isSameday);
  };

  const onShippingTrackingModalCloses = () => {
    setDeliveryReceipt(null);
    setIsSameday(false);
  };

  return (
    <div className="mb-10 lg:md-0 flex flex-col gap-8">
      {ordersData.length > 0 ? (
        ordersData.map((order) => (
          <div
            className="w-full rounded-sm overflow-hidden flex flex-col gap-2 lg:gap-4 p-2 border border-input text-xs md:text-sm lg:text-base"
            key={order.order_id}
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-2 flex flex-col gap-2">
                <div className="w-full flex flex-col gap-1">
                  <p className="font-bold">ID Pesanan</p>
                  <p>{order.order_id}</p>
                </div>

                <div className="w-full flex flex-col gap-1">
                  <p className="font-bold">Tanggal Pesanan</p>
                  <p>{getDateString(order.order_date)}</p>
                </div>

                <div className="w-full flex flex-col gap-1">
                  <p className="font-bold">Alamat Pengiriman</p>
                  <p>
                    {order.address
                      ? order.address.full_address
                      : "Alamat telah dihapus."}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-1">
                  <p className="font-bold">Ongkos Kirim</p>
                  <p>{rupiahConverter(order.shipping_cost)}</p>
                </div>

                <div className="w-full flex flex-col gap-1">
                  <p className="font-bold">Tipe Pesanan</p>
                  <p>{getOrderType(order.order_type)}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 justify-self-auto self-auto lg:justify-self-end lg:self-center">
                <p className="font-bold">
                  Status Pesanan: {orderStatusConverter(order.order_status)}
                </p>
                <p className="font-bold">
                  Total Harga: {rupiahConverter(order.total_price)}
                </p>
                {showOrderDeliveredButton(order.order_status, order.order_id)}
                <ShowOrderButton
                  status={order.order_status}
                  onPaymentClick={() => onPaymentClick(order)}
                  disabled={buttonLoading || order.payment_proof !== null}
                  onShippingTrackingClick={() =>
                    showShippingTrackingModal(
                      order.delivery_receipt,
                      order.isSameday
                    )
                  }
                />
                {showPaymentProof(order.order_status, order.payment_proof)}
                {order.order_delivered_date &&
                  showDeliveredDate(order.order_delivered_date)}
              </div>
            </div>

            {order.order_item.map((orderItem) => (
              <div
                className="w-full rounded-sm overflow-hidden p-2 flex flex-col lg:grid lg:grid-cols-3 gap-4 border border-input"
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
                    <p className="text-sm">
                      {orderItem.product.seller.account.user_name}
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
        <div className="w-full text-center">
          Tidak ada pesanan dalam status ini.
        </div>
      )}

      {deliveryReceipt && (
        <ShippingTracking
          delivery_receipt={deliveryReceipt}
          open={deliveryReceipt !== null}
          onClose={onShippingTrackingModalCloses}
          isSameday={isSameday}
        />
      )}
    </div>
  );
}
