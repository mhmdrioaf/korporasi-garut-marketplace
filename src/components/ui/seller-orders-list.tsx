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
        <TabsTrigger value="ALL">
          <div className="inline-flex gap-2 items-center">
            <p>{orders.shown.labels("ALL")}</p>
            <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
              {orders.data.ALL.length}
            </div>
          </div>
        </TabsTrigger>
        <TabsTrigger value="PENDING">
          <div className="inline-flex gap-2 items-center">
            <p>{orders.shown.labels("PENDING")}</p>
            <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
              {orders.data.PENDING.length}
            </div>
          </div>
        </TabsTrigger>
        <TabsTrigger value="PAID">
          <div className="inline-flex gap-2 items-center">
            <p>{orders.shown.labels("PAID")}</p>
            <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
              {orders.data.PAID.length}
            </div>
          </div>
        </TabsTrigger>
        <TabsTrigger value="PACKED">
          <div className="inline-flex gap-2 items-center">
            <p>{orders.shown.labels("PACKED")}</p>
            <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
              {orders.data.PACKED.length}
            </div>
          </div>
        </TabsTrigger>
        <TabsTrigger value="SHIPPED">
          <div className="inline-flex gap-2 items-center">
            <p>{orders.shown.labels("SHIPPED")}</p>
            <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
              {orders.data.SHIPPED.length}
            </div>
          </div>
        </TabsTrigger>
        <TabsTrigger value="DELIVERED">
          <div className="inline-flex gap-2 items-center">
            <p>{orders.shown.labels("DELIVERED")}</p>
            <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
              {orders.data.DELIVERED.length}
            </div>
          </div>
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
