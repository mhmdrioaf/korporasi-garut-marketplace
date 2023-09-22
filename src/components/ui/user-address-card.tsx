"use client";

import { TAddress } from "@/lib/globals";
import { phoneNumberGenerator, properizeWords } from "@/lib/helper";
import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "./use-toast";

interface IUserAddressCardProps {
  address: TAddress;
  isPrimary: boolean;
  setAddressToEdit: React.Dispatch<React.SetStateAction<TAddress | null>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setIsDelete: React.Dispatch<React.SetStateAction<boolean>>;
  setAddressIdToDelete: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function UserAddressCard({
  address,
  isPrimary,
  setAddressToEdit,
  setIsEdit,
  setIsDelete,
  setAddressIdToDelete,
}: IUserAddressCardProps) {
  const onAddressEdit = (address: TAddress) => {
    setAddressToEdit(null);
    setAddressToEdit(address);
    setIsEdit(true);
  };

  const onAddressDelete = (addressId: string) => {
    setAddressIdToDelete(null);
    setAddressIdToDelete(addressId);
    setIsDelete(true);
  };

  const { toast } = useToast();
  const router = useRouter();

  const onPrimaryAddressChanges = async (addressId: string, userId: string) => {
    const updateAddress = await fetch(
      process.env.NEXT_PUBLIC_API_UPDATE_USER!,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataToChange: "primary_address_id",
          dataValue: addressId,
          userId: userId,
        }),
      }
    );
    const updateResponse = await updateAddress.json();
    if (!updateResponse.ok) {
      toast({
        variant: "destructive",
        title: "Gagal memperbaharui alamat utama.",
        description: updateResponse.message,
      });
    } else {
      toast({
        variant: "success",
        title: "Berhasil memperbaharui alamat utama.",
        description: updateResponse.message,
      });
      router.refresh();
    }
  };
  return (
    <div className="w-full rounded-md border border-input overflow-hidden flex flex-row items-center justify-between p-2">
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2">
          <p className="font-bold">{properizeWords(address.label)}</p>
          {isPrimary && (
            <div className="px-1 py-px grid place-items-center rounded-sm bg-primary text-primary-foreground font-bold">
              Utama
            </div>
          )}
        </div>

        <p className="font-bold text-xl">{properizeWords(address.city)}</p>
        <div className="flex flex-row items-center gap-2 text-sm">
          <p>{address.recipient_name}</p>
          <p>-</p>
          <p>{phoneNumberGenerator(address.recipient_phone_number)}</p>
        </div>

        <p className="text-sm">{address.full_address}</p>
        <div className="w-full flex flex-row flex-nowrap items-center gap-2">
          {!isPrimary && (
            <>
              <button
                className="text-primary text-sm font-bold"
                onClick={() =>
                  onPrimaryAddressChanges(
                    address.address_id,
                    address.user_id.toString()
                  )
                }
              >
                Jadikan Alamat Utama
              </button>
              <p>|</p>
            </>
          )}
          <button
            className="text-primary text-sm font-bold"
            onClick={() => onAddressEdit(address)}
          >
            Ubah Data Alamat
          </button>
          <p>|</p>
          <button
            className="text-primary text-sm font-bold"
            onClick={() => onAddressDelete(address.address_id)}
          >
            Hapus Alamat
          </button>
        </div>
      </div>

      {isPrimary && <CheckIcon className="w-8 h-8 text-primary" />}
    </div>
  );
}
