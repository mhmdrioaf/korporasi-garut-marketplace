"use client";

import { TAddress, TCustomerCartItem, TShippingCost } from "@/lib/globals";
import { rupiahConverter, shippingEstimation } from "@/lib/helper";
import { useCart } from "@/lib/hooks/context/useCart";
import { CheckIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";

interface ICartCheckoutShippingCostProps {
  totalWeight: number;
  sellerAddress: TAddress;
  sellerID: number;
  items: TCustomerCartItem[];
}

export default function CartCheckoutShippingCost({
  totalWeight,
  sellerAddress,
  sellerID,
  items,
}: ICartCheckoutShippingCostProps) {
  const [shippingCost, setShippingCost] = useState<TShippingCost[] | null>(
    null
  );
  const { checkout, state } = useCart();

  const isButtonDisabled = (etd: number) => {
    const itemsStoragePeriod = items.map((item) => item.product.storage_period);
    return state.isPreOrder
      ? itemsStoragePeriod.some((period) => period + 7 <= etd)
      : itemsStoragePeriod.some((period) => period <= etd);
  };

  const shippingCostStyle = "w-full flex flex-row items-center justify-between";
  const chosenCourier = checkout.chosenCourier[sellerID];
  const isChosen = (courierValue: number) =>
    chosenCourier &&
    chosenCourier[courierValue] &&
    chosenCourier[courierValue].value === courierValue;

  useEffect(() => {
    const getShippingData = async () => {
      const _cost = await checkout.handler.shippingCost(
        sellerAddress,
        totalWeight
      );
      setShippingCost(_cost);
    };

    getShippingData();
  }, [checkout.handler, sellerAddress, totalWeight]);

  if (shippingCost) {
    return (
      <div className="w-full rounded-md flex flex-col gap-4">
        {shippingCost.map((shipping) => (
          <div key={shipping.code} className="w-full flex flex-col gap-2">
            <p className="font-bold">
              {shipping.code.toUpperCase()} - {shipping.name}
            </p>
            {shipping.costs.map((service) => (
              <div key={service.service} className="w-full flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-lg">{service.service}</p>
                  <p className="text-xs">{service.description}</p>
                </div>

                {service.cost.map((cost) => (
                  <div key={cost.value} className={shippingCostStyle}>
                    <div className="grid grid-cols-2 gap-2">
                      <p className="font-bold">Harga</p>
                      <p>{rupiahConverter(cost.value)}</p>
                      <p className="font-bold">Estimasi Pengiriman</p>
                      <p>
                        {state.isPreOrder
                          ? shippingEstimation(cost.etd) + 7
                          : shippingEstimation(cost.etd)}{" "}
                        Hari
                      </p>
                    </div>

                    {isChosen(cost.value) ? (
                      <CheckIcon className="w-8 h-8 text-primary" />
                    ) : (
                      <Button
                        variant="default"
                        onClick={() =>
                          checkout.handler.changeCourier(sellerID, cost)
                        }
                        disabled={isButtonDisabled(
                          state.isPreOrder
                            ? shippingEstimation(cost.etd) + 7
                            : shippingEstimation(cost.etd)
                        )}
                      >
                        {isButtonDisabled(
                          state.isPreOrder
                            ? shippingEstimation(cost.etd) + 7
                            : shippingEstimation(cost.etd)
                        )
                          ? "Tidak dapat dikirimkan ke alamat ini"
                          : "Pilih Kurir"}
                      </Button>
                    )}
                  </div>
                ))}
                <Separator />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
