"use client";

import { useForm } from "react-hook-form";
import Modal from "../modal";
import { Input } from "../input";
import { Button } from "../button";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useToast } from "../use-toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

interface IUserDeleteModalProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
  executor?: string;
}

type TUserDeleteInputs = {
  username: string;
};

export default function UserDeleteModal({
  username,
  isOpen,
  onClose,
  executor = "user",
}: IUserDeleteModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<TUserDeleteInputs>({
    mode: "onChange",
    defaultValues: {
      username: "",
    },
  });

  const onAccountDeleteHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_DELETE_USER!, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
        }),
      });

      const response = await res.json();

      if (!response.ok) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Gagal menghapus data user",
          description: response.message,
        });
      } else {
        setIsLoading(false);
        if (executor === "user") {
          router.replace(ROUTES.LANDING_PAGE);
        }
        router.refresh();
        onClose();
        toast({
          variant: "success",
          title: "Berhasil menghapus data user",
          description: response.message,
        });
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      toast({
        variant: "destructive",
        title: "Gagal menghapus user",
        description:
          "Telah terjadi kesalahan pada server, silahkan coba lagi nanti atau hubungi developer jika masalah berlanjut.",
      });
    }
  };

  return isOpen ? (
    <Modal defaultOpen={isOpen} onClose={onClose}>
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={onAccountDeleteHandler}
      >
        <div className="flex flex-col gap-2">
          <p className="text-2xl text-destructive font-bold">Hapus Akun</p>
          <div className="w-full rounded-md bg-destructive text-destructive-foreground p-2">
            <p className="text-sm">
              Tindakan ini akan menghapus akun anda selamanya dan tidak dapat
              dikembalikan. Jika anda sudah yakin akan menghapus akun ini, harap
              isi detail dibawah ini dengan {"nama pengguna (username) anda"}.
              Nama pengguna anda adalah <b>{username}</b>.
            </p>
          </div>
        </div>

        <Input
          type="text"
          required
          placeholder={username}
          {...form.register("username")}
        />
        <Button
          variant="destructive"
          type="submit"
          disabled={isLoading || username !== form.watch("username")}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              <span>Menghapus...</span>
            </>
          ) : (
            "Hapus Akun"
          )}
        </Button>
        <Button
          variant="secondary"
          type="button"
          disabled={isLoading}
          onClick={() => onClose()}
        >
          Batal
        </Button>
      </form>
    </Modal>
  ) : null;
}
