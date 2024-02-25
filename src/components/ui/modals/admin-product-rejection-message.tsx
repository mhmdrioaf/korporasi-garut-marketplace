"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "../button";
import Modal from "../modal";
import { Textarea } from "../textarea";
import { useFormStatus } from "react-dom";

interface IProductRejectionMessageProps {
  open: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

export default function ProductRejectionMessage({
  open,
  onSubmit,
  onClose,
}: IProductRejectionMessageProps) {
  return open ? (
    <Modal defaultOpen={open} onClose={onClose}>
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-bold text-primary">Penolakan Produk</p>
          <p className="text-sm">
            Berikan alasan kenapa produk ini ditolak untuk di unggah, harap
            berikan alasan yang jelas untuk mempermudah penjual dalam
            memperbaiki produknya.
          </p>
        </div>

        <form action={onSubmit} className="w-full flex flex-col gap-4">
          <Textarea
            placeholder="Alasan penolakan"
            name="message"
            id="message"
            required
          />
          <div className="w-full flex flex-col gap-2">
            <Button variant="destructive" type="submit">
              Kirim
            </Button>
            <Button variant="secondary" onClick={onClose} type="button">
              Batal
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  ) : null;
}
