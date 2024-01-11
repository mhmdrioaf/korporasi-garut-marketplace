"use client";

import { useState } from "react";
import { Button } from "../button";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";
import Modal from "../modal";
import { Loader2Icon } from "lucide-react";

interface IUserDisableModalProps {
  username: string;
  token: string;
  isOpen: boolean;
  onClose: () => void;
  isDeactivate: boolean;
}

export default function UserDisableModal({
  username,
  token,
  isOpen,
  onClose,
  isDeactivate,
}: IUserDisableModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const onAccountDisableHandler = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_DISABLE_USER!, {
        method: "PATCH",
        headers: { authorization: token },
        body: JSON.stringify({
          username: username,
          isDeactivate: isDeactivate,
        }),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: `Gagal ${
            isDeactivate ? "menonaktifkan" : "mengaktifkan"
          } user`,
          description: response.message,
        });
      } else {
        setIsLoading(false);
        router.refresh();
        toast({
          variant: "success",
          title: `Berhasil ${
            isDeactivate ? "menonaktifkan" : "mengaktifkan"
          } user`,
          description: response.message,
        });
        onClose();
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast({
        variant: "destructive",
        title: `Gagal ${isDeactivate ? "menonaktifkan" : "mengaktifkan"} user`,
        description:
          "Telah terjadi kesalahan pada server, silahkan coba lagi nanti atau hubungi developer jika masalah berlanjut.",
      });
    }
  };

  return isOpen ? (
    <Modal defaultOpen={isOpen} onClose={onClose}>
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p
            className={`${
              isDeactivate ? "text-destructive" : "text-primary"
            } text-2xl font-bold`}
          >
            {isDeactivate ? "Nonaktifkan" : "Aktifkan"} Pengguna
          </p>
          <p className="text-sm">
            Apakah anda yakin ingin{" "}
            {isDeactivate ? "menonaktifkan" : "mengaktifkan"} pengguna{" "}
            {username}?
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            variant={isDeactivate ? "destructive" : "default"}
            disabled={isLoading}
            onClick={onAccountDisableHandler}
          >
            {isLoading ? (
              <>
                <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <p>
                {isDeactivate ? "Nonaktifkan Pengguna" : "Aktifkan Pengguna"}
              </p>
            )}
          </Button>
          <Button variant="secondary" disabled={isLoading} onClick={onClose}>
            Batal
          </Button>
        </div>
      </div>
    </Modal>
  ) : null;
}
