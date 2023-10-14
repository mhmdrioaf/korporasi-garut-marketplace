"use client";

import { TAddress, TCity, TProvince } from "@/lib/globals";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import useSWR, { useSWRConfig } from "swr";
import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Button } from "./button";
import { Loader2Icon } from "lucide-react";
import { properizeWords } from "@/lib/helper";

interface IAddressFormProps {
  userId: string;
  defaultAddress?: TAddress;
  onUpdated?: () => void;
}

type TAddressInput = {
  fullAddress: string;
  recipient_name: string;
  recipient_phone: string;
  city: TCity;
  label: string;
};

export default function AddressForm({
  userId,
  defaultAddress,
  onUpdated,
}: IAddressFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<TAddressInput>({
    defaultValues: {
      fullAddress: defaultAddress?.full_address,
      recipient_name: defaultAddress?.recipient_name,
      recipient_phone: defaultAddress?.recipient_phone_number,
      city: {
        province_id: defaultAddress?.city.province_id,
        city_id: defaultAddress?.city.city_id,
      },
      label: defaultAddress?.label,
    },
    mode: "onChange",
  });

  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const { data: provinces, isLoading: provincesLoading } = useSWR(
    "/api/shipping/get-provinces",
    (url) =>
      fetch(url, {
        method: "GET",
        headers: { key: process.env.NEXT_PUBLIC_SHIPPING_TOKEN! },
      })
        .then((res) => res.json())
        .then((res) => res.data as TProvince[])
  );

  const onProvinceChangeHandler = (province_id: string) => {
    form.setValue("city.province_id", province_id);
    mutate("/api/shipping/get-cities/" + province_id);
  };

  const onCityChangeHandler = (city_id: string) => {
    form.setValue("city.city_id", city_id);
  };

  const { data: cities, isLoading: citiesLoading } = useSWR(
    `/api/shipping/get-cities/${form.watch("city.province_id")}`,
    (url) =>
      fetch(url, {
        method: "GET",
        headers: { key: process.env.NEXT_PUBLIC_SHIPPING_TOKEN! },
      })
        .then((res) => res.json())
        .then((res) => res.data as TCity[])
  );

  const onSubmit: SubmitHandler<TAddressInput> = async (data) => {
    setIsLoading(true);
    try {
      const addAddress = await fetch(
        process.env.NEXT_PUBLIC_API_CREATE_ADDRESS!,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            city_id: data.city.city_id,
            fullAddress: data.fullAddress,
            recipient_name: data.recipient_name,
            recipient_phone: data.recipient_phone,
            label: data.label,
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
        setIsLoading(false);
      } else {
        toast({
          variant: "success",
          title: "Berhasil menambahkan alamat.",
        });
        setIsLoading(false);
        router.back();
        router.refresh();
        router.push(ROUTES.USER.ADDRESSES);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description:
          "Telah terjadi kesalahan pada server, mohon coba lagi nanti.",
      });
    }
  };

  const onUpdate: SubmitHandler<TAddressInput> = async (data) => {
    setIsLoading(true);
    try {
      const editAddress = await fetch(
        process.env.NEXT_PUBLIC_API_UPDATE_ADDRESS!,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address_id: defaultAddress?.address_id,
            city_id: data.city.city_id,
            fullAddress: data.fullAddress,
            label: data.label,
            recipientName: data.recipient_name,
            recipientPhoneNumber: data.recipient_phone,
          }),
        }
      );

      const response = await editAddress.json();
      if (!response.ok) {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Terjadi Kesalahan",
          description: response.message ?? "",
        });
      } else {
        setIsLoading(false);
        toast({
          variant: "success",
          title: "Berhasil memperbaharui data alamat",
          description: response.message ?? "",
        });
        router.refresh();
        if (onUpdated) {
          onUpdated();
        }
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Terjadi Kesalahan",
        description: "Terjadi kesalahan pada server, harap coba lagi nanti.",
      });
    }
  };

  return (
    <form
      className="w-full rounded-lg overflow-hidden flex flex-col gap-4 lg:gap-8 p-4 lg:p-8"
      onSubmit={
        defaultAddress
          ? form.handleSubmit(onUpdate)
          : form.handleSubmit(onSubmit)
      }
    >
      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="recipient_name">Nama Penerima</Label>
        <Input
          type="text"
          id="recipient_name"
          placeholder="Nama Penerima"
          {...form.register("recipient_name")}
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="recipient_phone">Nomor Telepon Penerima</Label>
        <Input
          type="text"
          inputMode="tel"
          pattern="[0-9]*"
          id="recipient_phone"
          placeholder="08xxx"
          {...form.register("recipient_phone")}
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="province">Provinsi</Label>
        <Select
          onValueChange={(value) => onProvinceChangeHandler(value)}
          defaultValue={form.watch("city.province_id")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih provinsi" />
          </SelectTrigger>

          <SelectContent className="overflow-y-auto max-h-[45vh]">
            {provincesLoading ? (
              <SelectItem value="loading" disabled>
                Memuat provinsi...
              </SelectItem>
            ) : provinces ? (
              provinces.map((province) => (
                <SelectItem
                  key={province.province_id}
                  value={province.province_id}
                >
                  {province.province}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="error" disabled>
                Tidak ada provinsi
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="city">Kota/Kabupaten</Label>
        <Select
          onValueChange={(value) => onCityChangeHandler(value)}
          disabled={!form.watch("city.province_id")}
          defaultValue={form.watch("city.city_id")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih kota/kabupaten" />
          </SelectTrigger>

          <SelectContent className="overflow-y-auto max-h-[45vh]">
            {citiesLoading ? (
              <SelectItem value="loading" disabled>
                Memuat kota/kabupaten...
              </SelectItem>
            ) : cities ? (
              cities.map((city) => (
                <SelectItem key={city.city_id} value={city.city_id}>
                  {properizeWords(city.type)} {city.city_name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="error" disabled>
                Tidak ada kota/kabupaten
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="label">Label</Label>
        <Input
          type="text"
          id="label"
          placeholder="Rumah/Kantor"
          {...form.register("label")}
        />
      </div>

      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="fullAddress">Alamat Lengkap</Label>
        <Textarea
          id="fullAddress"
          placeholder="Kecamatan, Kelurahan, RT/RW, Kode Pos, Nomor Rumah"
          rows={5}
          {...form.register("fullAddress")}
        />
      </div>

      <Button variant="default" type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            <span>Menyimpan...</span>
          </>
        ) : (
          "Simpan"
        )}
      </Button>
    </form>
  );
}
