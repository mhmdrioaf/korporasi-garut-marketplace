"use client";

import { Button } from "@/components/ui/button";
import { ORDER_STATUS } from "../globals";

interface IOrderButtonProps {
  status: ORDER_STATUS;
  onPaymentClick: () => void;
  onShippingTrackingClick: () => void;
  disabled: boolean;
}

export default function ShowOrderButton({
  status,
  onPaymentClick,
  onShippingTrackingClick,
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
      return (
        <Button variant="outline" onClick={onShippingTrackingClick}>
          Lacak Pesanan
        </Button>
      );
    case "DELIVERED":
      return null;
    case "FINISHED":
      return null;
    default:
      return null;
  }
}
