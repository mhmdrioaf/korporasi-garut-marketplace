"use client";

import { useRouter } from "next/navigation";
import AuthRegister from "../auth/register";
import Modal from "../modal";
import { ScrollArea } from "../scroll-area";

export default function RegisterModal() {
  const router = useRouter();

  function onModalCloses() {
    router.refresh();
    router.back();
  }

  return (
    <Modal defaultOpen onClose={onModalCloses}>
      <ScrollArea className="w-full h-[calc(85vh-2rem)]">
        <div className="w-full flex flex-col gap-4 px-4 py-2">
          <div className="flex flex-col gap-2">
            <p className="text-2xl font-bold text-primary">Daftar</p>
            <p className="text-sm">
              Silahkan daftar untuk dapat segera menggunakan layanan kami.
            </p>
          </div>
          <AuthRegister referer="modal" />
        </div>
      </ScrollArea>
    </Modal>
  );
}
