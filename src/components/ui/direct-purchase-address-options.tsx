"use client";

import { TAddress, TUser } from "@/lib/globals";
import { phoneNumberGenerator, properizeWords } from "@/lib/helper";
import { Button } from "./button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Separator } from "./separator";

interface IDirectPurchaseAddressOptionsComponentProps {
  isOpen: boolean;
  user: TUser;
  user_address: TAddress[] | null;
  setOrderStep: (step: number | null) => void;
  setChosenAddress: (address: TAddress) => void;
}

export default function DirectPurchaseAddressOptions({
  user_address,
  setOrderStep,
  user,
  setChosenAddress,
  isOpen,
}: IDirectPurchaseAddressOptionsComponentProps) {
  const onAddressChoose = (chosenAddress: TAddress) => {
    setChosenAddress(chosenAddress);
    setOrderStep(2);
  };
  return isOpen ? (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl font-bold text-primary">Pemilihan Alamat</p>
        <p className="text-sm">
          Silahkan pilih alamat yang akan anda gunakan untuk pengiriman.
        </p>
      </div>
      <Separator />
      {user_address &&
        user_address.length > 0 &&
        user_address.map((address) => (
          <div
            key={address.address_id}
            className="w-full rounded-md flex flex-row items-center gap-4 border border-input px-4 py-2"
          >
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-row items-center gap-1">
                <p className="text-lg font-bold">{address.label}</p>
                {user.primary_address_id === address.address_id && (
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

            {/* TODO: Calculate Shipping Cost*/}
            <Button
              variant="default"
              onClick={() => onAddressChoose(address)}
              className="shrink-0"
            >
              Pilih Alamat Ini
            </Button>
          </div>
        ))}

      {user_address && user_address.length < 1 && (
        <div className="flex flex-col gap-2">
          <p className="text-lg">Anda belum memiliki alamat</p>
          <Link href={ROUTES.USER.ADDRESSES} className="font-bold text-lg">
            Klik disini untuk menambahkan alamat.
          </Link>
        </div>
      )}
    </div>
  ) : null;
}
