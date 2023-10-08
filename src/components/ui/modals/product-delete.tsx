"use client";

import { useState } from "react";
import { Button } from "../button";
import Modal from "../modal";
import { Loader2Icon } from "lucide-react";
import { TDeleteResponse } from "../dashboard-product-list";
import { useRouter } from "next/navigation";

interface IProductDeleteComponentProps {
  open: boolean;
  onClose: () => void;
  product_id: string;
  setDeleteResponse: React.Dispatch<
    React.SetStateAction<TDeleteResponse | null>
  >;
}

export default function ProductDelete({
  open,
  onClose,
  product_id,
  setDeleteResponse,
}: IProductDeleteComponentProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const onDeleteProduct = async () => {
    setIsLoading(true);
    const res = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_DELETE!, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: product_id,
      }),
    });

    const response = await res.json();
    if (!response.ok) {
      setIsLoading(false);
      setDeleteResponse({
        status: "destructive",
        message: response.message,
      });
    } else {
      setIsLoading(false);
      setDeleteResponse({
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
        <p className="text-xl font-bold text-destructive">Hapus Produk</p>
        <p className="text-sm">
          Perlu di ingat bahwa tindakan menghapus produk akan mengapus produk
          ini selamanya dan tidak dapat dikembalikan. Apakah anda yakin akan
          menghapus produk ini?
        </p>
        <div className="w-full flex flex-col gap-2">
          <Button
            className="w-full"
            variant="destructive"
            onClick={() => onDeleteProduct()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                <p>Menghapus...</p>
              </>
            ) : (
              "Hapus"
            )}
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
}
