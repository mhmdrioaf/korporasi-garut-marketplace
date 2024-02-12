"use client";

import Modal from "../modal";
import { ScrollArea } from "../scroll-area";
import AddressForm from "../address-form";

interface IUpdateAddressProps {
  address: TAddress;
  user_id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateAddressModal({
  address,
  isOpen,
  user_id,
  onClose,
}: IUpdateAddressProps) {
  return isOpen ? (
    <Modal defaultOpen={isOpen} onClose={onClose}>
      <ScrollArea className="w-full h-[calc(75vh-2rem)]">
        <AddressForm
          defaultAddress={address}
          userId={user_id}
          onUpdated={onClose}
        />
      </ScrollArea>
    </Modal>
  ) : null;
}
