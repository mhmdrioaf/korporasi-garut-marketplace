"use client";

import { rupiahConverter } from "@/lib/helper";
import { Button } from "./button";
import { useCart } from "@/lib/hooks/context/useCart";
import CartItemDeleteModal from "./modals/cart-item-delete";
import { Separator } from "./separator";

export default function UserCartList() {
  const { render, cartItems } = useCart();
  return (
    <div className="w-full grid grid-cols-4 relative">
      <div className="w-full flex flex-col gap-4 col-span-3">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-primary">Keranjang</p>
          <p className="text-sm">
            Berikut adalah daftar produk yang telah anda tambahkan ke keranjang
            belanjaan anda.
          </p>
        </div>
        {render.items()}
      </div>

      <div className="w-[calc(25%-4rem)] p-4 flex flex-col gap-2 rounded-md border border-input fixed justify-self-end">
        <p className="font-bold">Detail Belanja</p>
        <div className="w-full flex flex-row items-center justify-between text-sm">
          <p>Total Harga ({cartItems.checkedItemsCount} produk)</p>
          <p>{rupiahConverter(cartItems.checkedItemsPrice)}</p>
        </div>

        <Separator />

        <div className="w-full flex flex-row items-center justify-between font-bold text-lg">
          <p>Total Harga</p>
          <p>{rupiahConverter(cartItems.checkedItemsPrice)}</p>
        </div>

        <Separator />
        <Button variant="default">
          Checkout ({cartItems.checkedItemsCount})
        </Button>
      </div>

      <CartItemDeleteModal />
    </div>
  );
}
