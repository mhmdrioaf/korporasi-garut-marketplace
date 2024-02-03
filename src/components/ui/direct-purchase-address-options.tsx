"use client";

import { phoneNumberGenerator, properizeWords } from "@/lib/helper";
import { Button } from "./button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Separator } from "./separator";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";
import { PlusIcon } from "lucide-react";

export default function DirectPurchaseAddressOptions() {
  const { customer, order } = useDirectPurchase();

  return order.handler.isModalOpen(1) ? (
    <div className="w-full flex flex-col gap-4 text-xs md:text-base">
      <div className="w-full flex flex-col gap-1 md:gap-2">
        <div className="w-full flex flex-row items-center justify-between">
          <p className="text-base md:text-xl font-bold text-primary">
            Pemilihan Alamat
          </p>
          <div className="hidden md:block">
            <Button variant="default" asChild>
              <Link href={ROUTES.USER.ADD_ADDRESS}>Tambah Alamat</Link>
            </Button>
          </div>

          <div className="block md:hidden">
            <Button variant="default" size="sm" asChild>
              <Link href={ROUTES.USER.ADD_ADDRESS}>
                <PlusIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="text-xs md:text-sm">
          Silahkan pilih alamat yang akan anda gunakan untuk pengiriman.
        </p>
      </div>
      <Separator />
      {customer.user?.address &&
        customer.user.address.length > 0 &&
        customer.user.address.map((address) => (
          <div
            key={address.address_id}
            className="w-full rounded-md flex flex-col md:flex-row items-center gap-4 border border-input px-4 py-2"
          >
            <div className="w-full flex flex-col gap-1 md:gap-4">
              <div className="flex flex-row items-center gap-1">
                <p className="text-sm md:text-lg font-bold">{address.label}</p>
                {customer.user?.primary_address_id === address.address_id && (
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
              onClick={() => customer.address.handler.onAddressChange(address)}
              className="w-full md:w-fit shrink-0"
            >
              Pilih Alamat Ini
            </Button>
          </div>
        ))}

      {customer.user?.address && customer.user.address.length < 1 && (
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
