"use client";

import { ICustomerOrder } from "@/lib/globals";
import Image from "next/image";
import { Button } from "./button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface OrderCardProps {
  order: ICustomerOrder;
}

export default function OrderCard({ order }: OrderCardProps) {
  const showOrderButton = () => {
    const status = order.order_status;
    switch (status) {
      case "PENDING":
        return <Button variant="default">Bayar Pesanan</Button>;
      case "PAID":
        return (
          <Button variant="default" disabled>
            Lacak Pesanan
          </Button>
        );
      case "SHIPPED":
        return <Button variant="default">Lacak Pesanan</Button>;
      case "DELIVERED":
        return <Button variant="default">Pesanan Diterima</Button>;
      case "FINISHED":
        return <Button variant="default">Berikan Rating</Button>;
      default:
        return null;
    }
  };

  const orderDate = (value: any) => {
    const date = new Date(value);
    const stringDate = date.toDateString();
    return stringDate;
  };
  return (
    <div className="w-full rounded-sm overflow-hidden flex flex-col gap-2 lg:gap-4 p-2 border border-input">
      <div className="w-full flex flex-row items-start justify-between">
        <div className="w-fit grid grid-cols-2 gap-2">
          <p className="font-bold">ID Pesanan</p>
          <p>{order.order_id}</p>
          <p className="font-bold">Tanggal Pesanan</p>
          <p>{orderDate(order.order_date)}</p>
        </div>

        <div className="w-fit flex flex-col gap-2">
          <p className="font-bold">Status Pesanan: {order.order_status}</p>
          {showOrderButton()}
        </div>
      </div>

      {order.products.map((product) => (
        <div
          className="w-full rounded-sm overflow-hidden p-2 grid grid-cols-3 gap-4 border border-input"
          key={product.id}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="w-14 h-14 rounded-sm overflow-hidden relative">
              <Image
                src={product.images[0]}
                alt="product image"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-sm font-bold">{product.title}</p>
              <p className="text-sm">Nama Penjual</p>
            </div>
          </div>

          <p className="font-bold self-center">Rp. {product.price}</p>
          <Link
            href={ROUTES.PRODUCT.DETAIL(product.id.toString())}
            className="font-bold text-primary self-center place-self-end"
          >
            Lihat Produk
          </Link>
        </div>
      ))}
    </div>
  );
}
