"use client";

import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";
import Modal from "../modal";
import { Separator } from "../separator";
import { properizeWords } from "@/lib/helper";
import { Button } from "../button";
import { useRouter } from "next/navigation";

export default function SameDayProductAlert() {
  const { state, handler, product } = useDirectPurchase();
  const address = product.seller.address.find(
    (address) => address.address_id === product.seller.primary_address_id
  );
  const city = properizeWords(
    `${address?.city.type} ${address?.city.city_name}`
  );

  const router = useRouter();

  const onBackButtonClick = () => {
    router.back();
    handler.onSamedayModalClose();
  };

  return state.sameDayModalOpen ? (
    <Modal
      defaultOpen={state.sameDayModalOpen}
      onClose={handler.onSamedayModalClose}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap2">
          <p className="text-2xl text-primary font-bold">Peringatan</p>
          <p className="text-sm">Peringatan pemesanan terbatas</p>
        </div>

        <Separator />

        <div className="w-full flex flex-col gap-2">
          <p>
            Produk ini hanya dapat dipesan di kota yang sama. Jika anda berada
            di luar {city}, maka pesanan anda tidak dapat kami proses.
            Terimakasih
          </p>
          <Button variant="default" onClick={handler.onSamedayModalClose}>
            Lanjutkan Pemesanan
          </Button>
          <Button variant="destructive" onClick={onBackButtonClick}>
            Kembali
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
}
