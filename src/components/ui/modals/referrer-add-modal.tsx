"use client";

import { useRouter } from "next/navigation";
import Modal from "../modal";
import ReferrerAddForm from "../referrer-add-form";

export default function ReferrerAddModal() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };
  return (
    <Modal defaultOpen onClose={handleClose}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="font-bold text-primary text-2xl">Tambah Referrer</p>
          <p className="text-xs">
            Tambahkan NISN/NIS/NIP sebagai referral yang terdaftar.
          </p>
        </div>

        <ReferrerAddForm />
      </div>
    </Modal>
  );
}
