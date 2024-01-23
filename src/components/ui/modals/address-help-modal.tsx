"use client";

import Modal from "../modal";
import { Separator } from "../separator";

interface IAddressHelpModalProps {
  open: boolean;
  onClose: () => void;
  option: "district" | "village";
}

export default function AddressHelpModal(props: IAddressHelpModalProps) {
  const helpMessage = () => {
    switch (props.option) {
      case "district":
        return "Jika anda tidak menemukan data kecamatan anda, silahkan lewati bagian ini dan isi di bagian alamat lengkap";

      case "village":
        return "Jika anda tidak menemukan data desa anda, silahkan lewati bagian ini dan isi di bagian alamat lengkap";
    }
  };

  const message = helpMessage();

  return props.open ? (
    <Modal defaultOpen={props.open} onClose={props.onClose}>
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl text-primary font-bold">Bantuan</p>
        <Separator />
        <p className="text-sm">{message}</p>
      </div>
    </Modal>
  ) : null;
}
