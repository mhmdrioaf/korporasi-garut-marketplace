"use client";

import { deleteReferrer } from "@/lib/actions/referrer";
import Modal from "../modal";
import { useToast } from "../use-toast";
import { useState } from "react";
import { Button } from "../button";

interface IReferrerDeleteModalProps {
  referral_id: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReferrerDeleteModal({
  referral_id,
  isOpen,
  onClose,
}: IReferrerDeleteModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const onDelete = async () => {
    setLoading(true);
    const response = await deleteReferrer(referral_id);
    if (response.ok) {
      setLoading(false);
      toast({
        variant: "success",
        title: "Berhasil",
        description: "Referral berhasil dihapus",
      });
      onClose();
    } else {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Gagal menghapus referral",
      });
    }
  };
  return (
    <Modal defaultOpen={isOpen} onClose={onClose}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="font-bold text-destructive text-2xl">Hapus Referral</p>
          <p className="text-xs">
            Perlu diingat bahwa tindakan ini akan menghapus referral dengan ini
            selamanya, dan tidak dapat dikembalikan.
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <p className="text-sm">
            Apakah anda yakin akan menghapus referral dengan id {referral_id}?
          </p>
          <div className="w-full flex flex-row gap-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="w-full"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
