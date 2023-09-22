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

interface IOrderCardProps {
  order: TCustomerOrder;
}

export default function OrderCard({ order }: IOrderCardProps) {
  return (
    <div className="w-full rounded-sm overflow-hidden flex flex-col gap-2 lg:gap-4 p-2 border border-input">
      <div className="w-full flex flex-row items-start justify-between">
        <div className="w-fit grid grid-cols-2 gap-2">
          <p className="font-bold">ID Pesanan</p>
          <p>{order.order_id}</p>
          <p className="font-bold">Tanggal Pesanan</p>
          <p>{getDateString(order.order_date)}</p>
        </div>

        <div className="w-fit flex flex-col gap-2">
          <p className="font-bold">
            Status Pesanan: {orderStatusConverter(order.order_status)}
          </p>
          <ShowOrderButton status={order.order_status} />
        </div>
      </div>

      {order.order_items.map((orderItem) => (
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
              <p className="text-sm">Nama Penjual</p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p>Harga Produk: {rupiahConverter(orderItem.product.price)}</p>
            <p className="font-bold">
              Total Harga:{" "}
              {rupiahConverter(
                getTotalAmount(
                  orderItem.product.price,
                  orderItem.order_quantity
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
