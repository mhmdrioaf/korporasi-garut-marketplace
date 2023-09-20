"use client";

import { IAddress } from "@/lib/globals";
import { addressSchema } from "@/lib/resolver/addressResolver";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "../use-toast";
import Modal from "../modal";
import { ScrollArea } from "../scroll-area";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Button } from "../button";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpdateAddressProps {
  address: IAddress | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UpdateAddressModal({
  address,
  isOpen,
  onClose,
}: UpdateAddressProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof addressSchema>>({
    defaultValues: {
      city: address!.city,
      fullAddress: address!.full_address,
      label: address!.label,
      recipientName: address!.recipient_name,
      recipientPhoneNumber: address!.recipient_phone_number,
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const onModalCloses = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    setLoading(true);
    const { city, fullAddress, label, recipientName, recipientPhoneNumber } =
      values;

    try {
      const editAddress = await fetch(
        process.env.NEXT_PUBLIC_API_UPDATE_ADDRESS!,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address_id: address?.address_id,
            city: city,
            fullAddress: fullAddress,
            label: label,
            recipientName: recipientName,
            recipientPhoneNumber: recipientPhoneNumber,
          }),
        }
      );

      const response = await editAddress.json();
      if (!response.ok) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Terjadi Kesalahan",
          description: response.message ?? "",
        });
      } else {
        setLoading(false);
        toast({
          variant: "success",
          title: "Berhasil memperbaharui data alamat",
          description: response.message ?? "",
        });
        router.refresh();
        onModalCloses();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Terjadi kesalahan pada server, harap coba lagi nanti.",
      });
    }
  };

  return isOpen ? (
    <Modal defaultOpen={isOpen} onClose={onModalCloses}>
      <ScrollArea className="w-full h-[calc(75vh-2rem)]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full rounded-lg overflow-hidden flex flex-col gap-4 lg:gap-8 p-4 lg:p-8"
          >
            <div className="w-full flex flex-col gap-2 lg:gap-4">
              <p className="text-xl text-primary font-bold">Ubah Alamat</p>
              <p className="text-sm">
                Silahkan isi data alamat berikut ini dengan data alamat yang
                valid untuk memudahkan proses pengiriman.
              </p>
            </div>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kota/Kabupaten</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      placeholder="Garut"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {'Harap isi dengan nama kabupaten/kota, contoh: "Garut"'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Lengkap</FormLabel>
                  <FormControl>
                    <Textarea
                      required
                      cols={4}
                      placeholder="Jl. Pramuka No.24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Harap isi dengan alamat pengiriman yang lengkap, sertakan
                    nomor rumah dan/atau patokan lokasi pengiriman.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Penerima</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      placeholder="Nama penerima..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipientPhoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon Penerima</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      pattern={"[0-9]*"}
                      placeholder="08xxx"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <span>
                      Harap isi nomor telepon dengan format: <b>08xxx</b>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label Alamat</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      placeholder="Rumah/Kantor"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    <span>
                      Harap isi label alamat dengan jenis lokasi seperti:{" "}
                      <b>Rumah/Kantor/Toko dll.</b>
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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
          </form>
        </Form>
      </ScrollArea>
    </Modal>
  ) : null;
}
