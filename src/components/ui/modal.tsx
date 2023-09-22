"use client";

import { Dialog, DialogContent } from "./dialog";
import { useState } from "react";

interface IModalComponentProps {
  children: React.ReactNode;
  defaultOpen: boolean;
  onClose: () => void;
}

export default function Modal({
  defaultOpen = true,
  onClose,
  children,
}: IModalComponentProps) {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(!open);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
