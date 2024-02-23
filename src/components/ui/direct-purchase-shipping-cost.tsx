"use client";

import { rupiahConverter, shippingEstimation } from "@/lib/helper";
import { Button } from "./button";
import { Separator } from "./separator";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";
import { CheckIcon } from "lucide-react";

export default function DirectPurchaseShippingCost() {
  const { shipping: shippingData, state, product } = useDirectPurchase();

  const isButtonDisabled = (etd: number) => {
    const currentDate = new Date();
    const itemExpirationDate = new Date(product.expire_date);
    const deliveredDate = state.isPreorder
      ? new Date(currentDate.getTime() + (7 + etd) * 24 * 60 * 60 * 1000)
      : new Date(currentDate.getTime() + etd * 24 * 60 * 60 * 1000);

    return deliveredDate >= itemExpirationDate;
  };

  const getOrderShippingDate = () => {
    const currentDate = new Date();
    const currentTime = currentDate.getHours();
    const isDaytime = currentTime >= 7 && currentTime <= 17;
    const deliveredDate = state.isPreorder
      ? new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000)
      : !isDaytime
        ? new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000)
        : currentDate;
    return deliveredDate;
  };

  const getOrderDeliveredDate = (etd: number) => {
    const currentDate = new Date();
    const deliveredDate = !state.isPreorder
      ? new Date(currentDate.getTime() + etd * 24 * 60 * 60 * 1000)
      : new Date(currentDate.getTime() + (7 + etd) * 24 * 60 * 60 * 1000);
    return deliveredDate;
  };

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
              {shipping.costs
                .filter((service) =>
                  service.cost.some(
                    (cost) => !isButtonDisabled(shippingEstimation(cost.etd))
                  )
                )
                .map((service) => (
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

                    {service.cost.map((cost) => (
                      <div key={cost.value} className={shippingCostStyle}>
                        <div className="w-fit flex flex-col gap-2">
                          <div className="w-full flex flex-col gap-1">
                            <p className="font-bold">Harga</p>
                            <p>{rupiahConverter(cost.value)}</p>
                          </div>

                          <div className="w-full flex flex-col gap-1">
                            <p className="font-bold">Estimasi Pengiriman</p>
                            <p className="text-xs">
                              Estimasi tanggal pengiriman:{" "}
                              {getOrderShippingDate().toLocaleDateString(
                                "id-ID",
                                {
                                  day: "2-digit",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </p>
                            <p className="text-xs">
                              Estimasi tanggal pesanan diterima:{" "}
                              {getOrderDeliveredDate(
                                shippingEstimation(cost.etd)
                              ).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>

                        {shippingData.chosenCourier &&
                        shippingData.chosenCourier.value === cost.value ? (
                          <CheckIcon className="w-8 h-8 text-primary" />
                        ) : (
                          <Button
                            variant="default"
                            onClick={() =>
                              shippingData.handler.onCourierChange({
                                etd: cost.etd,
                                value: cost.value,
                                note: cost.note,
                                service: service.service,
                              })
                            }
                            disabled={!state.orderable}
                            className="w-full md:w-fit"
                          >
                            {state.orderable
                              ? "Pilih Kurir"
                              : "Pengiriman tidak tersedia"}
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
