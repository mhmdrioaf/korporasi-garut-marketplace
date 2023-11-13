"use client";

import OrderDeliveryReceipt from "./order-delivery-receipt";
import { useOrderManagement } from "@/lib/hooks/context/useOrderManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import SellerOrderCard from "./seller-order-card";
import { useSearchParams } from "next/navigation";

export default function SellerOrderList() {
  const searchParams = useSearchParams();
  const orderState = searchParams.get("state") ?? "ALL";

  const { orders } = useOrderManagement();

  return (
    <Tabs
      defaultValue={orderState}
      className="w-full flex flex-col gap-4 overflow-hidden"
    >
      <TabsList className="overflow-x-auto">
        <TabsTrigger value="ALL">{orders.shown.labels("ALL")}</TabsTrigger>
        <TabsTrigger value="PENDING">
          {orders.shown.labels("PENDING")}
        </TabsTrigger>
        <TabsTrigger value="PAID">{orders.shown.labels("PAID")}</TabsTrigger>
        <TabsTrigger value="PACKED">
          {orders.shown.labels("PACKED")}
        </TabsTrigger>
        <TabsTrigger value="SHIPPED">
          {orders.shown.labels("SHIPPED")}
        </TabsTrigger>
        <TabsTrigger value="DELIVERED">
          {orders.shown.labels("DELIVERED")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="ALL">
        <SellerOrderCard ordersData={orders.data.ALL} />
      </TabsContent>
      <TabsContent value="PENDING">
        <SellerOrderCard ordersData={orders.data.PENDING} />
      </TabsContent>
      <TabsContent value="PAID">
        <SellerOrderCard ordersData={orders.data.PAID} />
      </TabsContent>
      <TabsContent value="PACKED">
        <SellerOrderCard ordersData={orders.data.PACKED} />
      </TabsContent>
      <TabsContent value="SHIPPED">
        <SellerOrderCard ordersData={orders.data.SHIPPED} />
      </TabsContent>
      <TabsContent value="DELIVERED">
        <SellerOrderCard ordersData={orders.data.DELIVERED} />
      </TabsContent>

      <OrderDeliveryReceipt />
    </Tabs>
  );
}
