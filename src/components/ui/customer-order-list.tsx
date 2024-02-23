"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { useSearchParams } from "next/navigation";
import { sortOrders } from "@/lib/helper";
import dynamic from "next/dynamic";
import Loading from "@/app/loading";

const OrderCard = dynamic(() => import("./order-card"), {
  ssr: false,
  loading: () => <Loading />,
});

interface ICustomerOrdersListProps {
  orders: TOrder[];
}

type TOrderShown = "ALL" | ORDER_STATUS;

export default function CustomerOrderList({
  orders,
}: ICustomerOrdersListProps) {
  const searchParams = useSearchParams();
  const orderState = searchParams.get("state") ?? "ALL";

  const ordersData = {
    ALL: sortOrders(orders),
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
    <Tabs
      defaultValue={orderState}
      className="w-full flex flex-col gap-4 lg:gap-8 overflow-hidden"
    >
      <div className="w-full overflow-auto">
        <TabsList>
          <TabsTrigger value="ALL">
            <div className="inline-flex gap-2 items-center">
              <p>{orderShownLabel("ALL")}</p>
              <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
                {ordersData.ALL.length}
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="PENDING">
            <div className="inline-flex gap-2 items-center">
              <p>{orderShownLabel("PENDING")}</p>
              <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
                {ordersData.PENDING.length}
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="PAID">
            <div className="inline-flex gap-2 items-center">
              <p>{orderShownLabel("PAID")}</p>
              <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
                {ordersData.PAID.length}
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="PACKED">
            <div className="inline-flex gap-2 items-center">
              <p>{orderShownLabel("PACKED")}</p>
              <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
                {ordersData.PACKED.length}
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="SHIPPED">
            <div className="inline-flex gap-2 items-center">
              <p>{orderShownLabel("SHIPPED")}</p>
              <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
                {ordersData.SHIPPED.length}
              </div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="DELIVERED">
            <div className="inline-flex gap-2 items-center">
              <p>{orderShownLabel("DELIVERED")}</p>
              <div className="rounded-full bg-destructive text-destructive-foreground text-xs p-1 w-6 h-6 grid place-items-center text-center">
                {ordersData.DELIVERED.length}
              </div>
            </div>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="ALL">
        <OrderCard ordersData={ordersData.ALL as TOrder[]} />
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
