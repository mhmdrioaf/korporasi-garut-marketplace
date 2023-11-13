"use client";

import { ORDER_STATUS, TCustomerOrder } from "@/lib/globals";
import OrderCard from "./order-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useSearchParams } from "next/navigation";

interface ICustomerOrdersListProps {
  orders: TCustomerOrder[];
}

type TOrderShown = "ALL" | ORDER_STATUS;

export default function CustomerOrderList({
  orders,
}: ICustomerOrdersListProps) {
  const searchParams = useSearchParams();
  const orderState = searchParams.get("state") ?? "ALL";
  
  const ordersData = {
    ALL: orders,
    PENDING: orders.filter((order) => order.order_status === "PENDING"),
    PAID: orders.filter((order) => order.order_status === "PAID"),
    PACKED: orders.filter((order) => order.order_status === "PACKED"),
    SHIPPED: orders.filter((order) => order.order_status === "SHIPPED"),
    DELIVERED: orders.filter((order) => order.order_status === "DELIVERED"),
  };
  const orderShownLabel = (options: TOrderShown) => {
    switch (options) {
      case "ALL":
        return "Semua";
      case "PAID":
        return "Menunggu Pengiriman";
      case "PACKED":
        return "Dikemas";
      case "SHIPPED":
        return "Sedang Dikirim";
      case "PENDING":
        return "Menunggu Pembayaran";
      default:
        return "Selesai";
    }
  };
  return (
    <Tabs defaultValue={orderState} className="w-full flex flex-col gap-4 lg:gap-8">
      <TabsList>
        <TabsTrigger value="ALL">{orderShownLabel("ALL")}</TabsTrigger>
        <TabsTrigger value="PENDING">{orderShownLabel("PENDING")}</TabsTrigger>
        <TabsTrigger value="PAID">{orderShownLabel("PAID")}</TabsTrigger>
        <TabsTrigger value="PACKED">{orderShownLabel("PACKED")}</TabsTrigger>
        <TabsTrigger value="SHIPPED">{orderShownLabel("SHIPPED")}</TabsTrigger>
        <TabsTrigger value="DELIVERED">
          {orderShownLabel("DELIVERED")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ALL">
        <OrderCard ordersData={ordersData.ALL} />
      </TabsContent>
      <TabsContent value="PENDING">
        <OrderCard ordersData={ordersData.PENDING} />
      </TabsContent>
      <TabsContent value="PAID">
        <OrderCard ordersData={ordersData.PAID} />
      </TabsContent>
      <TabsContent value="PACKED">
        <OrderCard ordersData={ordersData.PACKED} />
      </TabsContent>
      <TabsContent value="SHIPPED">
        <OrderCard ordersData={ordersData.SHIPPED} />
      </TabsContent>
      <TabsContent value="DELIVERED">
        <OrderCard ordersData={ordersData.DELIVERED} />
      </TabsContent>
    </Tabs>
  );
}
