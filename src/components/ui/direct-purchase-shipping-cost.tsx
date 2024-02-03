"use client";

import { rupiahConverter, shippingEstimation } from "@/lib/helper";
import { Button } from "./button";
import { Separator } from "./separator";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";
import { CheckIcon } from "lucide-react";

export default function DirectPurchaseShippingCost() {
  const { shipping: shippingData, state, product } = useDirectPurchase();

  const shippingCostStyle =
    "w-full flex flex-col gap-2 md:flex-row items-start justify-normal md:items-center md:justify-between";

  if (shippingData.cost.loading || shippingData.cost.validating) {
    return (
      <div className="w-full rounded-md bg-gray-100 h-10 animate-pulse"></div>
    );
  }

  if (state.orderable && shippingData.cost.data) {
    return (
      <div className="w-full rounded-md flex flex-col gap-4 text-xs md:text-base">
        {!shippingData.sameDay.isSameDay &&
          shippingData.cost.data.map((shipping) => (
            <div key={shipping.code} className="w-full flex flex-col gap-2">
              <p className="font-bold">
                {shipping.code.toUpperCase()} - {shipping.name}
              </p>
              {shipping.costs.map((service) => (
                <div
                  key={service.service}
                  className="w-full flex flex-col gap-2"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-xs md:text-base">
                      {service.service}
                    </p>
                    <p className="text-xs">{service.description}</p>
                  </div>

                  {service.cost
                    .filter(
                      (cost) =>
                        shippingEstimation(cost.etd) < product.storage_period
                    )
                    .map((cost) => (
                      <div key={cost.value} className={shippingCostStyle}>
                        <div className="w-fit flex flex-col gap-2">
                          <div className="w-full flex flex-col gap-1">
                            <p className="font-bold">Harga</p>
                            <p>{rupiahConverter(cost.value)}</p>
                          </div>

                          <div className="w-full flex flex-col gap-1">
                            <p className="font-bold">Estimasi Pengiriman</p>
                            <p>
                              {state.isPreorder
                                ? shippingEstimation(cost.etd) + 7
                                : shippingEstimation(cost.etd)}{" "}
                              Hari
                            </p>
                          </div>
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
                              shippingEstimation(cost.etd) >=
                                product.storage_period
                            }
                            className="w-full md:w-fit"
                          >
                            {state.orderable &&
                            shippingEstimation(cost.etd) <=
                              product.storage_period
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

        {shippingData.sameDay.isSameDay && (
          <div className="w-full flex flex-row items-center gap-2 justify-between">
            <div className="flex flex-col gap-2">
              <p className="font-bold">Korporasi Delivery</p>
              <p className="text-xs">
                Estimasi Pengiriman {shippingData.sameDay.sameDayETA + 5} Menit
              </p>
              <p className="text-xs">
                Harga: {rupiahConverter(shippingData.sameDay.sameDayCost)}
              </p>
            </div>

            {!shippingData.sameDay.courierSelected ? (
              <Button
                variant="default"
                onClick={shippingData.handler.onSamedayCourierChange}
              >
                Pilih Kurir
              </Button>
            ) : (
              <CheckIcon className="w-8 h-8 text-primary" />
            )}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col gap-4">
        <p className="font-bold">Kurir tidak tersedia</p>
        <p className="text-xs">
          Kurir tidak tersedia untuk pengiriman ke alamat ini
        </p>
      </div>
    );
  }
}
