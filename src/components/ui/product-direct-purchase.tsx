"use client";

import { TAddress, TProduct } from "@/lib/globals";
import { fetcher } from "@/lib/helper";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "./button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import DirectPurchaseAddressOptions from "./direct-purchase-address-options";
import Modal from "./modal";

interface IProductDirectPurchaseComponentProps {
  product: TProduct;
  user_id: string | null;
  product_quantity: number;
  product_variant: string | null;
}

export default function ProductDirectPurchase({
  product,
  product_quantity,
  product_variant,
  user_id,
}: IProductDirectPurchaseComponentProps) {
  const [orderStep, setOrderStep] = useState<number | null>(null);
  const [shouldLogin, setShouldLogin] = useState(false);
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
          <div className="w-full flex flex-col gap-4">
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
          </div>
        </Modal>
      )}
      <Button variant="default" onClick={onOrder} disabled={userLoading}>
        Beli Sekarang
      </Button>
    </>
  );
}
