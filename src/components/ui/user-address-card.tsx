"use client";

import { IAddress } from "@/lib/globals";
import {
  addressLabelConverter,
  phoneNumberGenerator,
  properizeWords,
} from "@/lib/helper";
import { Button } from "./button";
import { CheckIcon } from "lucide-react";

interface UserAddressCardProps {
  address: IAddress;
}

export default function UserAddressCard({ address }: UserAddressCardProps) {
  return (
    <div className="w-full rounded-md border border-input overflow-hidden flex flex-row items-center justify-between p-2">
      <div className="flex flex-col gap-2 max-w-[45%]">
        <div className="flex flex-row items-center gap-2">
          <p className="font-bold">
            {properizeWords(addressLabelConverter(address.address_label) ?? "")}
          </p>
          <div className="px-1 py-px grid place-items-center rounded-sm bg-primary text-primary-foreground font-bold">
            Utama
          </div>
        </div>

        <p className="font-bold text-xl">{properizeWords(address.city)}</p>
        <div className="flex flex-row items-center gap-2 text-sm">
          <p>Nama Penerima</p>
          <p>-</p>
          <p>{phoneNumberGenerator("085157878637")}</p>
        </div>

        <p className="text-sm">{address.full_address}</p>
        <div className="flex flex-row items-center gap-2">
          <button className="text-primary text-sm font-bold">
            Jadikan Alamat Utama
          </button>
          <p>|</p>
          <button className="text-primary text-sm font-bold">
            Ubah Data Alamat
          </button>
          <p>|</p>
          <button className="text-primary text-sm font-bold">
            Hapus Alamat
          </button>
        </div>
      </div>

      <CheckIcon className="w-8 h-8 text-primary" />
    </div>
  );
}
