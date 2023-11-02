"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./input";
import { Label } from "./label";
import Modal from "./modal";
import { ORDER_STATUS } from "@/lib/globals";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";

interface IOrderDeliveryReceiptProps {
  orderStatusChanger: (
    order_status: ORDER_STATUS | null,
    order_id: string,
    delivery_receipt: string | null
  ) => Promise<void>;
  order_detail: {
    order_id: string;
    order_status: ORDER_STATUS;
  };
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  defaultValue: string | null;
}

export default function OrderDeliveryReceipt({
  orderStatusChanger,
  isOpen,
  isLoading,
  onClose,
  order_detail,
  defaultValue,
}: IOrderDeliveryReceiptProps) {
  const form = useForm<{ no_resi: string }>({
    mode: "onBlur",
    defaultValues: {
      no_resi: defaultValue ?? undefined,
    },
  });

  const onSubmit: SubmitHandler<{ no_resi: string }> = async (data) => {
    const { no_resi } = data;
    const { order_id, order_status } = order_detail;

    return await orderStatusChanger(order_status, order_id, no_resi);
  };
  return isOpen ? (
    <Modal defaultOpen={isOpen} onClose={onClose}>
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
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
          <Input type="text" required {...form.register("no_resi")} />
        </div>

        <Button variant="default" disabled={isLoading} type="submit">
          {isLoading ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              <span>Mengirim Resi...</span>
            </>
          ) : defaultValue ? (
            "Ubah Resi"
          ) : (
            "Kirim Resi"
          )}
        </Button>
      </form>
    </Modal>
  ) : null;
}
