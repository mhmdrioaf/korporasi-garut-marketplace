"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { sortOrders } from "@/lib/helper";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  IOrderDeliveryReceiptInput,
  TOrderManagementContext,
  TOrderShown,
} from "./orderManagementContextType";

export const OrderManagementContext =
  createContext<TOrderManagementContext | null>(null);

export function useOrderManagement() {
  return useContext(OrderManagementContext) as TOrderManagementContext;
}

interface IOrderManagementContextProviderProps {
  orders_data: TOrder[];
  seller: {
    id: string;
    token: string;
  };
  children: ReactNode;
}

export function OrderManagementContextProvider({
  orders_data,
  seller,
  children,
}: IOrderManagementContextProviderProps) {
  const [orderShownOptions, setOrderShownOptions] =
    useState<TOrderShown>("ALL");
  const [updating, setUpdating] = useState<boolean>(false);
  const [isGivingReceipt, setIsGivingReceipt] = useState<boolean>(false);

  const [orderToUpdate, setOrderToUpdate] = useState<TOrder | null>(null);

  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<IOrderDeliveryReceiptInput>({
    mode: "onChange",
    defaultValues: {
      delivery_receipt: orderToUpdate?.delivery_receipt ?? "",
    },
  });

  const orders = {
    ALL: sortOrders(orders_data) as TOrder[],
    PENDING: orders_data.filter((order) => order.order_status === "PENDING"),
    PAID: orders_data.filter((order) => order.order_status === "PAID"),
    PACKED: orders_data.filter((order) => order.order_status === "PACKED"),
    SHIPPED: orders_data.filter((order) => order.order_status === "SHIPPED"),
    DELIVERED: orders_data.filter(
      (order) => order.order_status === "DELIVERED"
    ),
    FINISHED: orders_data.filter((order) => order.order_status === "FINISHED"),
  };

  const ordersShown = {
    list: [
      "ALL",
      "PENDING",
      "PAID",
      "PACKED",
      "SHIPPED",
      "DELIVERED",
    ] as TOrderShown[],
    labels: (options: TOrderShown) => {
      switch (options) {
        case "ALL":
          return "Semua";
        case "PENDING":
          return "Menunggu Pembayaran";
        case "PAID":
          return "Menunggu Pengiriman";
        case "PACKED":
          return "Dikemas";
        case "SHIPPED":
          return "Sedang Dikirim";
        default:
          if (options === "DELIVERED" || options === "FINISHED") {
            return "Selesai";
          } else {
            return "Semua";
          }
      }
    },
  };

  const showActionButton = (order: TOrder) => {
    const getButtonTitle = () => {
      switch (order.order_status) {
        case "PENDING":
          return { title: "Kemas Pesanan" };
        case "PAID":
          return { title: "Kemas Pesanan" };
        case "PACKED":
          return { title: "Kirim Pesanan" };
        case "SHIPPED":
          if (order.delivery_receipt) {
            return { title: "Ubah Resi" };
          } else {
            return { title: "Kirim Resi Pengiriman" };
          }
        default:
          return { title: null };
      }
    };
    const { title } = getButtonTitle();

    function getOrderStatus() {
      switch (order.order_status) {
        case "PENDING":
          return order.order_status;
        case "PAID":
          return "PACKED";
        case "PACKED":
          return "SHIPPED";
        case "SHIPPED":
          return "SHIPPED";
        default:
          return null;
      }
    }
    const status = getOrderStatus();

    const isReturn = status !== null && title !== null;
    const isDisabled = status === "PENDING";

    const action =
      status !== "SHIPPED"
        ? () => changeOrderStatus(status, order.order_id, null, null)
        : () => {
            setOrderToUpdate(order);
            setIsGivingReceipt(true);
          };

    if (isReturn) {
      return (
        <Button
          variant="default"
          onClick={action}
          disabled={updating || isDisabled}
        >
          {updating ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              <span>Mengubah status...</span>
            </>
          ) : (
            <span>{title}</span>
          )}
        </Button>
      );
    } else {
      return null;
    }
  };

  function onOrderShownChanges(options: TOrderShown) {
    setOrderShownOptions(options);
  }

  function onModalClose() {
    setIsGivingReceipt(false);
    setUpdating(false);
    setOrderToUpdate(null);
    form.reset();
  }

  async function changeOrderStatus(
    order_status: ORDER_STATUS | null,
    order_id: string,
    delivery_receipt: string | null,
    order_items: Pick<TOrder, "order_item"> | null
  ) {
    setUpdating(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_ORDER_UPDATE_STATUS!, {
      method: "PATCH",
      headers: {
        token: seller.token,
      },
      body: JSON.stringify({
        order_id: order_id,
        order_status: order_status,
        delivery_receipt: delivery_receipt,
        order_items: order_items,
      }),
    });

    const response = await res.json();

    if (!response.ok) {
      setUpdating(false);
      toast({
        variant: "destructive",
        title: "Gagal mengubah status pesanan",
        description: response.message,
      });
    } else {
      setUpdating(false);
      toast({
        variant: "success",
        title: "Berhasil mengubah status pesanan",
        description: response.message,
      });
      onModalClose();
      router.refresh();
    }
  }

  const onDeliveryReceiptGiven: SubmitHandler<
    IOrderDeliveryReceiptInput
  > = async (data) => {
    const { delivery_receipt } = data;
    if (!orderToUpdate) {
      throw new Error("Data pesanan belum disediakan!");
    } else {
      const { order_id } = orderToUpdate;
      return await changeOrderStatus("SHIPPED", order_id, delivery_receipt, {
        order_item: orderToUpdate.order_item,
      });
    }
  };

  const value: TOrderManagementContext = {
    orders: {
      data: orders,
      shown: {
        list: ordersShown.list,
        labels: ordersShown.labels,
        handler: {
          onOrderShownChanges: onOrderShownChanges,
        },
        active: orderShownOptions,
      },
      state: {
        isUpdating: updating,
        isGivingReceipt: isGivingReceipt,
        orderToUpdate: orderToUpdate,
      },
      handler: {
        changeStatus: changeOrderStatus,
        closeModal: onModalClose,
        deliveryReceiptForm: form,
        giveOrderDeliveryReceipt: onDeliveryReceiptGiven,
      },
    },

    renderer: {
      actionButton: showActionButton,
    },
  };

  return (
    <OrderManagementContext.Provider value={value}>
      {children}
    </OrderManagementContext.Provider>
  );
}
