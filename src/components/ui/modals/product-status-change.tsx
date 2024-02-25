"use client";

import { useState } from "react";
import { Button } from "../button";
import Modal from "../modal";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface IProductStatusChangeModalProps {
  open: boolean;
  onClose: () => void;
  product_id: string;
  options: "APPROVED" | "REJECTED";
  token: string;
  setStatusUpdateResponse: React.Dispatch<
    React.SetStateAction<{
      status: "destructive" | "success";
      message: string;
    } | null>
  >;
  onReject: () => void;
}

export default function ProductStatusChangeModal({
  open,
  onClose,
  product_id,
  options,
  token,
  onReject,
  setStatusUpdateResponse,
}: IProductStatusChangeModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const onProductStatusChange = async () => {
    setIsLoading(true);
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_PRODUCT_STATUS_UPDATE!,
      {
        method: "PATCH",
        headers: { authorization: token },
        body: JSON.stringify({
          productId: product_id,
          status: options,
          message: null,
        }),
      }
    );

    const response = await res.json();
    if (!response.ok) {
      setIsLoading(false);
      setStatusUpdateResponse({
        status: "destructive",
        message: response.message,
      });
    } else {
      setIsLoading(false);
      setStatusUpdateResponse({
        status: "success",
        message: response.message,
      });
      onClose();
      router.refresh();
    }
  };

  return open ? (
    <Modal defaultOpen={open} onClose={onClose}>
      <div className="w-full flex flex-col gap-4">
        <p className="text-xl font-bold text-primary">
          {options === "APPROVED" ? "Menyetujui" : "Menolak"} Produk
        </p>
        <p className="text-sm">
          Apakah anda yakin akan{" "}
          {options === "APPROVED" ? "menyetujui" : "menolak"} produk ini?
        </p>
        <div className="w-full flex flex-col gap-2">
          <Button
            className="w-full"
            variant="default"
            onClick={options === "REJECTED" ? onReject : onProductStatusChange}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                <p>
                  {options === "APPROVED" ? "Menyetujui" : "Menolak"} produk...
                </p>
              </>
            ) : (
              "Ya"
            )}
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Tidak
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
}
