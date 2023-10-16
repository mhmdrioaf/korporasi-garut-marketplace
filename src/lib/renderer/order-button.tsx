"use client";

import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "../globals";

interface IOrderButtonProps {
  status: ORDER_STATUS;
  onPaymentClick: () => void;
  disabled: boolean;
}

export default function ShowOrderButton({
  status,
  onPaymentClick,
  disabled,
}: IOrderButtonProps) {
  switch (status) {
    case "PENDING":
      return (
        <Button variant="default" onClick={onPaymentClick} disabled={disabled}>
          Bayar Pesanan
        </Button>
      );
    case "PAID":
      return (
        <Button variant="default" disabled>
          Lacak Pesanan
        </Button>
      );
    case "SHIPPED":
      return <Button variant="default">Lacak Pesanan</Button>;
    case "DELIVERED":
      return <Button variant="default">Pesanan Diterima</Button>;
    case "FINISHED":
      return <Button variant="default">Berikan Rating</Button>;
    default:
      return null;
  }
}
