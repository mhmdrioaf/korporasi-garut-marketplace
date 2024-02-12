"use client";

import UserAddressCard from "./user-address-card";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useState } from "react";
import UpdateAddressModal from "./modals/user-address-update";
import { sortAddress } from "@/lib/helper";
import DeleteAddressModal from "./modals/user-address-delete";

interface IUserAddressListProps {
  addresses: TAddress[];
  primaryAddressId: string | null;
  user_id: string;
}

export default function UserAddressList({
  addresses,
  primaryAddressId,
  user_id,
}: IUserAddressListProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const [addressToEdit, setAddressToEdit] = useState<TAddress | null>(null);
  const [addressIdToDelete, setAddressIdToDelete] = useState<string | null>(
    null
  );

  const sortedAddress = addresses.sort((address) =>
    sortAddress(address, primaryAddressId ?? "")
  );

  const onModalCloses = () => {
    setIsEdit(false);
    setAddressToEdit(null);
    setIsDelete(false);
    setAddressIdToDelete(null);
  };

  return addresses.length > 0 ? (
    <>
      {isEdit && addressToEdit && (
        <UpdateAddressModal
          address={addressToEdit}
          isOpen={isEdit}
          onClose={onModalCloses}
          user_id={user_id}
        />
      )}

      {isDelete && addressIdToDelete && (
        <DeleteAddressModal
          addressId={addressIdToDelete ?? ""}
          isOpen={isDelete}
          onClose={onModalCloses}
        />
      )}

      <div className="w-full flex flex-col gap-4 mb-10 lg:mb-0">
        {sortedAddress.map((address) => (
          <UserAddressCard
            address={address}
            isPrimary={primaryAddressId === address.address_id}
            setIsEdit={setIsEdit}
            setAddressToEdit={setAddressToEdit}
            setAddressIdToDelete={setAddressIdToDelete}
            setIsDelete={setIsDelete}
            key={address.address_id}
          />
        ))}
      </div>
    </>
  ) : (
    <div className="w-full grid place-items-center">
      <p>
        Anda belum menambahkan data alamat,{" "}
        <Link href={ROUTES.USER.ADD_ADDRESS} className="font-bold text-primary">
          Klik disini untuk menambahkan.
        </Link>
      </p>
    </div>
  );
}
