"use client";

import { useState } from "react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";
import Modal from "../modal";
import { Button } from "../button";

interface IUserDeleteProps {
  addressId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAddressModal({
  addressId,
  isOpen,
  onClose,
}: IUserDeleteProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const onDelete = async () => {
    setLoading(true);

    try {
      const deleteAddress = await fetch(
        process.env.NEXT_PUBLIC_API_DELETE_ADDRESS!,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address_id: addressId }),
        }
      );

      const response = await deleteAddress.json();
      if (!response.ok) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Gagal menghapus data alamat.",
          description: response.message,
        });
      } else {
        setLoading(false);
        toast({
          variant: "success",
          title: "Berhasil menghapus data alamat",
          description: response.message,
        });
        router.refresh();
        onClose();
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast({
        variant: "destructive",
        title: "Gagal menghapus data alamat.",
        description:
          "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
      });
    }
  };

  return isOpen ? (
    <Modal defaultOpen={isOpen} onClose={onClose}>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-destructive">Hapus Alamat</p>
          <p className="text-sm">
            Apakah anda yakin akan menghapus alamat ini?
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <Button disabled={loading} variant="destructive" onClick={onDelete}>
            Hapus
          </Button>
          <Button disabled={loading} variant="secondary" onClick={onClose}>
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
}
