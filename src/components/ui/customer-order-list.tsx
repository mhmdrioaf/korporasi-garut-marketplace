"use client";

import { ICustomerOrder } from "@/lib/globals";
import OrderCard from "./order-card";

interface CustomerOrdersListProps {
  orders: ICustomerOrder[];
}

export default function CustomerOrderList({ orders }: CustomerOrdersListProps) {
  return (
    <div className="w-full flex flex-col gap-4 lg:gap-4">
      {orders.map((order) => (
        <OrderCard order={order} key={order.order_id} />
      ))}
    </div>
  );
}
