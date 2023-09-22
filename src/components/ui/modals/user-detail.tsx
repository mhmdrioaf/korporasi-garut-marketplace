"use client";

import { Input } from "../input";
import Modal from "../modal";
import { useToast } from "../use-toast";
import { Label } from "../label";
import { Button } from "../button";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface IUserDetailModalProps {
  options: "name" | "username" | "phone_number" | null;
  userId: string;
  defaultValue: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailsModal({
  options,
  isOpen,
  userId,
  defaultValue,
  onClose,
}: IUserDetailModalProps) {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const optionsLabel =
    options === "name"
      ? "Nama Lengkap"
      : options === "username"
      ? "Nama pengguna"
      : "Nomor telepon";

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!options) return;
    try {
      setLoading(true);
      const updateUser = await fetch(process.env.NEXT_PUBLIC_API_UPDATE_USER!, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataToChange: options,
          dataValue: value,
          userId: userId,
        }),
      });

      const updateResponse = await updateUser.json();
      if (!updateResponse.ok) {
        setLoading(false);
        toast({
          variant: "destructive",
          description: updateResponse.message,
        });
      } else {
        setLoading(false);
        toast({
          variant: "success",
          description: updateResponse.message,
        });
        onClose();
        router.refresh();
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      toast({
        variant: "destructive",
        description:
          "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
      });
    }
  };

  return options ? (
    <Modal defaultOpen={isOpen} onClose={onClose}>
      <div className="w-full flex flex-col gap-2">
        <p className="text-xl font-bold">Ubah Informasi Akun</p>
        <p className="text-sm">
          Silahkan isi dengan informasi yang valid, untuk menghindari kesalahan
          ketika melakukan transaksi.
        </p>
      </div>
      <form className="w-full flex flex-col gap-4" onSubmit={onSubmitHandler}>
        <Label htmlFor={options}>{optionsLabel}</Label>
        <Input
          type="text"
          pattern={options === "phone_number" ? "[0-9]*" : undefined}
          name={options}
          defaultValue={defaultValue ?? ""}
          onChange={(e) => setValue(e.target.value)}
        />

        <Button variant="default" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            "Simpan"
          )}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={onClose}
          disabled={loading}
        >
          Batal
        </Button>
      </form>
    </Modal>
  ) : null;
}
