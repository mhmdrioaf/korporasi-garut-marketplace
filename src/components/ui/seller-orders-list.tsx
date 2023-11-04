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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import SellerOrderCard from "./seller-order-card";

export default function SellerOrderList() {
  const { orders, renderer } = useOrderManagement();

  const orderShownButtonStyle = (isActive: boolean, isLoading: boolean) => {
    const defaultStyle =
      "px-4 py-2 rounded-md text-center hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer select-none";
    const activeStyle = " bg-primary text-primary-foreground";
    const loadingStyle =
      "w-fit px-4 py-2 rounded-md bg-input animate-pulse text-transparent";

    return isActive && !isLoading
      ? defaultStyle + activeStyle
      : !isActive && !isLoading
      ? defaultStyle
      : loadingStyle;
  };

  return (
    <Tabs
      defaultValue="ALL"
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
