"use client";

import { rupiahConverter, shippingEstimation } from "@/lib/helper";
import { Button } from "./button";
import { Separator } from "./separator";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";
import { CheckIcon } from "lucide-react";

export default function DirectPurchaseShippingCost() {
  const { shipping: shippingData, state, product } = useDirectPurchase();

  const shippingCostStyle = "w-full flex flex-row items-center justify-between";

  if (shippingData.cost.loading || shippingData.cost.validating) {
    return (
      <div className="w-full rounded-md bg-gray-100 h-10 animate-pulse"></div>
    );
  }

  if (shippingData.cost.data) {
    return (
      <div className="w-full rounded-md flex flex-col gap-4">
        {shippingData.cost.data.map((shipping) => (
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
                        {state.isPreorder
                          ? shippingEstimation(cost.etd) + 7
                          : shippingEstimation(cost.etd)}{" "}
                        Hari
                      </p>
                    </div>

                    {shippingData.chosenCourier &&
                    shippingData.chosenCourier === cost ? (
                      <CheckIcon className="w-8 h-8 text-primary" />
                    ) : (
                      <Button
                        variant="default"
                        onClick={() =>
                          shippingData.handler.onCourierChange(cost)
                        }
                        disabled={
                          !state.orderable ||
                          shippingEstimation(cost.etd) >= product.storage_period
                        }
                      >
                        {state.orderable &&
                        shippingEstimation(cost.etd) <= product.storage_period
                          ? "Pilih Kurir"
                          : "Pengiriman tidak didukung"}
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
