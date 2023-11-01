"use client";

import { useCart } from "@/lib/hooks/context/useCart";
import Modal from "./modal";
import { Separator } from "./separator";
import { CheckCircle2Icon } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

interface ICartCheckoutProps {
  children: React.ReactNode;
  open: boolean;
}

export default function CartCheckout({ children, open }: ICartCheckoutProps) {
  const { checkout } = useCart();
  const dotsStyles = "w-4 h-4 rounded-full ";

  return open ? (
    <Modal defaultOpen={open} onClose={checkout.handler.resetCheckoutState}>
      <div className="w-full max-h-[85vh] overflow-y-auto flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-2xl text-primary font-bold">Checkout</p>
          <p className="text-sm">
            Proses checkout atas pesanan dalam keranjang.
          </p>
        </div>
        <div className="w-full flex flex-row items-center gap-2 justify-center">
          {[...Array(3)].map((_, index) => (
            <div className="flex flex-row items-center gap-2" key={index}>
              <div
                className={
                  checkout.step === index + 1
                    ? dotsStyles + "bg-primary"
                    : dotsStyles + "bg-gray-300"
                }
              />
              {(index === 0 || index === 1) && (
                <div className="w-2 h-px bg-gray-300" />
              )}
            </div>
          ))}
        </div>
        <Separator />

        {children}

        {checkout.step === 3 && (
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2 items-center justify-center">
              <CheckCircle2Icon className="w-10 h-10 text-green-950" />
              <p className="text-2xl font-bold">Pemesanan Berhasil!</p>
            </div>
            <Link
              href={ROUTES.USER.ORDERS}
              className="px-4 py-2 rounded-sm text-sm bg-primary text-primary-foreground text-center"
            >
              Lihat Pesanan
            </Link>
          </div>
        )}
      </div>
    </Modal>
  ) : null;
}
