"use client";

import { useCart } from "@/lib/hooks/context/useCart";
import { Separator } from "./separator";
import { phoneNumberGenerator, properizeWords } from "@/lib/helper";
import { Button } from "./button";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";

export default function CartCheckoutAddress() {
  const { checkout } = useCart();

  return checkout.step === 1 ? (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <p className="text-xl font-bold text-primary">Pemilihan Alamat</p>
        <p className="text-sm">
          Silahkan pilih alamat yang akan anda gunakan untuk pengiriman.
        </p>
      </div>
      <Separator />
      {checkout.customer.data?.address &&
        checkout.customer.data.address.length > 0 &&
        checkout.customer.data.address.map((address) => (
          <div
            key={address.address_id}
            className="w-full rounded-md flex flex-row items-center gap-4 border border-input px-4 py-2"
          >
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-row items-center gap-1">
                <p className="text-lg font-bold">{address.label}</p>
                {checkout.customer.data?.primary_address_id ===
                  address.address_id && (
                  <div className="p-1 rounded-md grid place-items-center bg-primary text-primary-foreground font-bold">
                    <p>Utama</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">
                  {properizeWords(address.recipient_name)}
                </p>
                <p className="text-sm">
                  {phoneNumberGenerator(address.recipient_phone_number)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">
                  {address.city.city_name}, {address.city.province}
                </p>
                <p className="text-sm">{address.full_address}</p>
              </div>
            </div>

            <Button
              variant="default"
              onClick={() => checkout.handler.chooseAddress(address)}
              className="shrink-0"
            >
              Pilih Alamat Ini
            </Button>
          </div>
        ))}

      {checkout.customer.data?.address &&
        checkout.customer.data.address.length < 1 && (
          <div className="flex flex-col gap-2">
            <p className="text-lg">Anda belum memiliki alamat</p>
            <Link href={ROUTES.USER.ADD_ADDRESS} className="font-bold text-lg">
              Klik disini untuk menambahkan alamat.
            </Link>
          </div>
        )}
    </div>
  ) : null;
}
