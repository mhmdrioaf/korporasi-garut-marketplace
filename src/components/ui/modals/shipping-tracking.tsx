"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import Modal from "../modal";
import { useToast } from "../use-toast";

interface IShippingTrackingProps {
  delivery_receipt: string;
  open: boolean;
  onClose: () => void;
}

export default function ShippingTracking({
  delivery_receipt,
  open,
  onClose,
}: IShippingTrackingProps) {
  const [isCopied, setIsCopied] = useState(false);

  const textRef = useRef<HTMLInputElement>(null);

  const onModalCloses = () => {
    setIsCopied(false);
    onClose();
  };

  const { toast } = useToast();

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(delivery_receipt);
      setIsCopied(true);
      toast({
        description: "Nomor resi berhasil disalin",
      });
    }
  };

  useEffect(() => {
    document.addEventListener("copy", (e) => {
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", delivery_receipt);
        setIsCopied(true);
        toast({
          description: "Nomor resi berhasil disalin",
        });
      }
    });
  }, [delivery_receipt, toast]);

  return open ? (
    <Modal defaultOpen={open} onClose={onModalCloses}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="font-bold text-2xl text-primary">Pelacakan Pesanan</p>
          <p className="text-sm">
            Silahkan salin nomor resi dibawah ini, lalu klik tombol lacak
            pesanan untuk menuju ke halaman pelacakan pesanan
          </p>
        </div>
        <div className="w-full flex flex-col gap-2">
          <b>Nomor Resi</b>
          <div className="w-full flex flex-row items-center gap-2">
            <Input type="text" ref={textRef} value={delivery_receipt} />
            <Button variant="default" onClick={copyToClipboard}>
              Salin
            </Button>
          </div>
        </div>

        <Button
          variant={isCopied ? "default" : "outline"}
          asChild
          disabled={isCopied}
        >
          {isCopied ? (
            <Link href={"https://jne.co.id/tracking-package"} target="_blank">
              Lacak Paket
            </Link>
          ) : (
            <p>Silahkan salin nomor resi terlebih dahulu</p>
          )}
        </Button>
      </div>
    </Modal>
  ) : null;
}
