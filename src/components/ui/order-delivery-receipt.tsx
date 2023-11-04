"use client";

import { Input } from "./input";
import { Label } from "./label";
import Modal from "./modal";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";
import { useOrderManagement } from "@/lib/hooks/context/useOrderManagement";

export default function OrderDeliveryReceipt() {
  const { orders } = useOrderManagement();

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
            Pemberian Resi Pengiriman
          </p>
          <p className="text-sm">
            Berikan resi pengiriman yang sesuai dengan resi pada <i>receipt</i>{" "}
            pengiriman paket.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="noresi">Nomor Resi</Label>
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
              <span>Mengirim Resi...</span>
            </>
          ) : orders.state.orderToUpdate?.delivery_receipt ? (
            "Ubah Resi"
          ) : (
            "Kirim Resi"
          )}
        </Button>
      </form>
    </Modal>
  ) : null;
}
