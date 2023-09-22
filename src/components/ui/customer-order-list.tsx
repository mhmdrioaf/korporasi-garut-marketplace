"use client";

import { TCustomerOrder } from "@/lib/globals";
import OrderCard from "./order-card";

interface ICustomerOrdersListProps {
  orders: TCustomerOrder[];
}

export default function CustomerOrderList({
  orders,
}: ICustomerOrdersListProps) {
  return (
    <div className="w-full flex flex-col gap-4 lg:gap-4">
      {orders.map((order) => (
        <OrderCard order={order} key={order.order_id} />
      ))}
    </div>
  );
}
