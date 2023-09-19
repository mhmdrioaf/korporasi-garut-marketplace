"use client";

import { IAddress } from "@/lib/globals";
import UserAddressCard from "./user-address-card";
import Link from "next/link";

interface UserAddressListProps {
  addresses: IAddress[];
}

export default function UserAddressList({ addresses }: UserAddressListProps) {
  return addresses.length > 0 ? (
    <div className="w-full flex flex-col gap-4">
      {addresses.map((address) => (
        <UserAddressCard address={address} key={address.address_id} />
      ))}
    </div>
  ) : (
    <div className="w-full grid place-items-center">
      <p>
        Anda belum menambahkan data alamat,{" "}
        <Link href="#" className="font-bold text-primary">
          Klik disini untuk menambahkan.
        </Link>
      </p>
    </div>
  );
}
