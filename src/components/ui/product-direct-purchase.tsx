"use client";

import { TAddress, TProduct, TProductVariantItem } from "@/lib/globals";
import { fetcher } from "@/lib/helper";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import DirectPurchaseAddressOptions from "./direct-purchase-address-options";
import Modal from "./modal";
import DirectPurchaseOrderDetail from "./direct-purchase-order-detail";
import { CheckCircle2Icon } from "lucide-react";
import Link from "next/link";

interface IProductDirectPurchaseComponentProps {
  product: TProduct;
  user_id: string | null;
  product_quantity: number;
  product_variant: TProductVariantItem | null;
  totalPrice: number;
}

export default function ProductDirectPurchase({
  product,
  product_quantity,
  product_variant,
  user_id,
  totalPrice,
}: IProductDirectPurchaseComponentProps) {
  const [orderStep, setOrderStep] = useState<number | null>(null);
  const [chosenAddress, setChosenAddress] = useState<TAddress | null>(null);

  const router = useRouter();

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useSWR(user_id ? "/api/get-detail/" + user_id : null, fetcher);

  const onOrder = () => {
    if (user) {
      setOrderStep(1);
    } else {
      router.push(ROUTES.AUTH.LOGIN);
    }
  };

  const isModalOpen = (currentStep: number) => {
    return orderStep === currentStep;
  };

  const dotsStyles = "w-4 h-4 rounded-full ";
  return (
    <>
      {orderStep && (
        <Modal
          defaultOpen={orderStep !== null}
          onClose={() => setOrderStep(null)}
        >
          <div className="w-full max-h-[85vh] overflow-y-auto flex flex-col gap-4">
            <div className="w-full flex flex-row items-center gap-2 justify-center">
              {[...Array(3)].map((_, index) => (
                <div className="flex flex-row items-center gap-2" key={index}>
                  <div
                    className={
                      orderStep === index + 1
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

            <DirectPurchaseAddressOptions
              isOpen={isModalOpen(1)}
              setChosenAddress={setChosenAddress}
              setOrderStep={setOrderStep}
              user={user?.result}
              user_address={user?.result?.address}
            />

            <DirectPurchaseOrderDetail
              product={product}
              product_quantity={product_quantity}
              product_variant={product_variant}
              shipping_address={chosenAddress!}
              user_id={user_id}
              totalPrice={totalPrice}
              isOpen={isModalOpen(2)}
              setOrderStep={setOrderStep}
            />

            {isModalOpen(3) && (
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
      <Button variant="default" onClick={onOrder} disabled={userLoading}>
        Beli Sekarang
      </Button>
    </>
  );
}
