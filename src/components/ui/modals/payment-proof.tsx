"use client";

import Modal from "../modal";
import { Invoice } from "xendit-node/invoice/models";
import { useRouter } from "next/navigation";
import PaymentProofComponent from "../payment-proof-component";

interface IPaymentProofProps {
  invoice: Invoice;
  isOpen: boolean;
}

export default function PaymentProofModal({
  invoice,
  isOpen,
}: IPaymentProofProps) {
  const router = useRouter();

  const onClose = () => {
    router.back();
  };

  return isOpen ? (
    <Modal defaultOpen={isOpen} onClose={onClose}>
      <PaymentProofComponent invoice={invoice} />
    </Modal>
  ) : null;
}
