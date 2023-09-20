"use client";

import { useRouter } from "next/navigation";
import Modal from "../modal";
import { ScrollArea } from "../scroll-area";
import AddAddressForm from "../add-address";

interface AddAddressComponentProps {
  userId: string;
}

export default function AddAddress({ userId }: AddAddressComponentProps) {
  const router = useRouter();

  const onModalCloses = () => {
    router.refresh();
    router.back();
  };

  return (
    <Modal defaultOpen onClose={onModalCloses}>
      <ScrollArea className="w-full h-[calc(75vh-2rem)]">
        <AddAddressForm userId={userId} />
      </ScrollArea>
    </Modal>
  );
}
