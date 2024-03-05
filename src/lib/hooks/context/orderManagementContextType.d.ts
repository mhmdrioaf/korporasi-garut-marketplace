import { SubmitHandler, UseFormReturn } from "react-hook-form";

type TOrderManagementContext = {
  orders: {
    data: {
      ALL: TSellerOrder[];
      PENDING: TSellerOrder[];
      PAID: TSellerOrder[];
      PACKED: TSellerOrder[];
      SHIPPED: TSellerOrder[];
      DELIVERED: TSellerOrder[];
      FINISHED: TSellerOrder[];
    };

    shown: {
      list: TOrderShown[];
      labels: (
        options: TOrderShown
      ) =>
        | "Semua"
        | "Menunggu Pembayaran"
        | "Menunggu Pengiriman"
        | "Dikemas"
        | "Sedang Dikirim"
        | "Selesai";
      handler: {
        onOrderShownChanges: (options: TOrderShown) => void;
      };
      active: TOrderShown;
    };

    handler: {
      changeStatus: (
        order_status: ORDER_STATUS | null,
        order_id: string,
        delivery_receipt: string | null,
        order_items: Pick<TSellerOrder, "order_item"> | null
      ) => void;
      closeModal: () => void;
      deliveryReceiptForm: UseFormReturn<
        IOrderDeliveryReceiptInput,
        any,
        undefined
      >;
      giveOrderDeliveryReceipt: SubmitHandler<IOrderDeliveryReceiptInput>;
    };

    state: {
      isUpdating: boolean;
      isGivingReceipt: boolean;
      orderToUpdate: TSellerOrder | null;
    };
  };

  renderer: {
    actionButton: (orderData: TSellerOrder) => React.JSX.Element | null;
  };
};

type TOrderShown = "ALL" | ORDER_STATUS;

export interface IOrderDeliveryReceiptInput {
  delivery_receipt: string | null;
}
