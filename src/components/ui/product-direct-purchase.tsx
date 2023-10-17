"use client";

import { Button } from "./button";
import { ROUTES } from "@/lib/constants";
import DirectPurchaseAddressOptions from "./direct-purchase-address-options";
import Modal from "./modal";
import DirectPurchaseOrderDetail from "./direct-purchase-order-detail";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";

export default function ProductDirectPurchase() {
  const { order, customer } = useDirectPurchase();

  const dotsStyles = "w-4 h-4 rounded-full ";
  return (
    <>
      {order.step && (
        <Modal
          defaultOpen={order.step !== null}
          onClose={() => order.setStep(null)}
        >
          <div className="w-full max-h-[85vh] overflow-y-auto flex flex-col gap-4">
            <div className="w-full flex flex-row items-center gap-2 justify-center">
              {[...Array(3)].map((_, index) => (
                <div className="flex flex-row items-center gap-2" key={index}>
                  <div
                    className={
                      order.step === index + 1
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

            <DirectPurchaseAddressOptions />

            <DirectPurchaseOrderDetail />

            {order.handler.isModalOpen(3) && (
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
      )}
      <Button
        variant="default"
        onClick={order.handler.onOrder}
        disabled={customer.loading}
      >
        Beli Sekarang
      </Button>
    </>
  );
}
