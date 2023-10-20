"use client";

import { useCart } from "@/lib/hooks/context/useCart";
import { Button } from "../button";
import Modal from "../modal";
import { Loader2Icon } from "lucide-react";

export default function CartItemDeleteModal() {
  const { cartItems } = useCart();
  return cartItems.isDelete ? (
    <Modal
      defaultOpen={cartItems.isDelete}
      onClose={() => cartItems.setIsDelete(false)}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-destructive">
            Hapus Produk dari Keranjang
          </p>
          <p className="text-sm">
            Apakah anda yakin ingin menghapus produk ini dari keranjang anda?
          </p>
        </div>

        <div className="w-full flex flex-col gap-2">
          <Button
            variant="destructive"
            onClick={cartItems.handler.delete}
            disabled={cartItems.isLoading}
          >
            {cartItems.isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              "Hapus"
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={() => cartItems.setIsDelete(false)}
            disabled={cartItems.isLoading}
          >
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
}
