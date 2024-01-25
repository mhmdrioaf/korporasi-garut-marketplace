"use client";

import { Input } from "./input";
import { Label } from "./label";
import Modal from "./modal";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";
import { useOrderManagement } from "@/lib/hooks/context/useOrderManagement";

export default function OrderDeliveryReceipt() {
  const { orders } = useOrderManagement();

  const buttonMessage = () => {
    if (orders.state.orderToUpdate?.isSameday) {
      if (orders.state.orderToUpdate?.delivery_receipt) {
        return "Ubah Tautan";
      } else {
        return "Kirim Tautan";
      }
    } else {
      if (orders.state.orderToUpdate?.delivery_receipt) {
        return "Ubah Resi";
      } else {
        return "Kirim Resi";
      }
    }
  };

  return orders.state.isGivingReceipt ? (
    <Modal
      defaultOpen={orders.state.isGivingReceipt}
      onClose={orders.handler.closeModal}
    >
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={orders.handler.deliveryReceiptForm.handleSubmit(
          orders.handler.giveOrderDeliveryReceipt
        )}
      >
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl text-primary font-bold">
            {orders.state.orderToUpdate?.isSameday
              ? "Pemberian Tautan Live Location"
              : "Pemberian Resi Pengiriman"}
          </p>
          <p className="text-sm">
            {orders.state.orderToUpdate?.isSameday ? (
              "Berikan tautan live location dari google maps untuk kurir pengiriman yang mengirimkan pesanan ini. Tautan ini digunakan untuk konsumen melacak pesanannya."
            ) : (
              <>
                Berikan resi pengiriman yang sesuai dengan resi pada{" "}
                <i>receipt</i> pengiriman paket. Pastikan resi yang diberikan
                sudah benar dan sesuai
              </>
            )}
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="noresi">
            {orders.state.orderToUpdate?.isSameday
              ? "Tautan Maps"
              : "Nomor Resi"}
          </Label>
          <Input
            type="text"
            required
            defaultValue={orders.state.orderToUpdate?.delivery_receipt ?? ""}
            {...orders.handler.deliveryReceiptForm.register("delivery_receipt")}
          />
        </div>

        <Button
          variant="default"
          disabled={orders.state.isUpdating}
          type="submit"
        >
          {orders.state.isUpdating ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              {orders.state.orderToUpdate?.isSameday ? (
                "Mengirim tautan..."
              ) : (
                <span>Mengirim Resi...</span>
              )}
            </>
          ) : (
            buttonMessage()
          )}
        </Button>
      </form>
    </Modal>
  ) : null;
}
