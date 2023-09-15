"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "./dialog";

interface ModalComponentProps {
  children: React.ReactNode;
}

export default function Modal({ children }: ModalComponentProps) {
  const router = useRouter();

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open onOpenChange={handleOnOpenChange}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
