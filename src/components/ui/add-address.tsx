"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import * as z from "zod";
import { addressSchema } from "@/lib/resolver/addressResolver";

interface IAddAddressProps {
  userId: string;
}

export default function AddAddressForm({ userId }: IAddAddressProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof addressSchema>>({
    defaultValues: {
      city: "",
      fullAddress: "",
      recipientName: "",
      recipientPhoneNumber: "",
      label: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof addressSchema>) => {
    const { city, fullAddress, recipientName, recipientPhoneNumber, label } =
      values;
    setLoading(true);

    try {
      const addAddress = await fetch(
        process.env.NEXT_PUBLIC_API_CREATE_ADDRESS!,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            city: city,
            fullAddress: fullAddress,
            recipientName: recipientName,
            recipientPhoneNumber: recipientPhoneNumber,
            label: label,
          }),
        }
      );

      const response = await addAddress.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Terjadi Kesalahan",
          description: response.message,
        });
        setLoading(false);
      } else {
        toast({
          variant: "success",
          title: "Berhasil menambahkan alamat.",
        });
        setLoading(false);
        router.back();
        router.refresh();
        router.push(ROUTES.USER.ADDRESSES);
      }
    } catch (err) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description:
          "Telah terjadi kesalahan pada server, mohon coba lagi nanti.",
      });
      console.error(err);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full rounded-lg overflow-hidden flex flex-col gap-4 lg:gap-8 p-4 lg:p-8"
      >
        <div className="w-full flex flex-col gap-2 lg:gap-4">
          <p className="text-xl text-primary font-bold">Tambah Alamat</p>
          <p className="text-sm">
            Silahkan isi data alamat berikut ini dengan data alamat yang valid
            untuk memudahkan proses pengiriman.
          </p>
        </div>
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kota/Kabupaten</FormLabel>
              <FormControl>
                <Input type="text" required placeholder="Garut" {...field} />
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
                Harap isi dengan alamat pengiriman yang lengkap, sertakan nomor
                rumah dan/atau patokan lokasi pengiriman.
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
  );
}
