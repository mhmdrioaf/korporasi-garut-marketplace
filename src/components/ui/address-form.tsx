"use client";

import { useEffect, useState } from "react";
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
import { Button } from "./button";
import { HelpCircleIcon, Loader2Icon } from "lucide-react";
import { properizeWords } from "@/lib/helper";
import AddressHelpModal from "./modals/address-help-modal";
import Alert from "./modals/alert";

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
  district: string;
  village: string;
};

export default function AddressForm({
  userId,
  defaultAddress,
  onUpdated,
}: IAddressFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const [isAlert, setIsAlert] = useState<boolean>(false);
  const [help, setHelp] = useState<{
    option: "district" | "village";
    open: boolean;
  }>({
    option: "district",
    open: false,
  });

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
      district: defaultAddress?.district ?? "NO_DATA",
      village: defaultAddress?.village,
    },
    mode: "onChange",
  });

  const { toast } = useToast();
  const { mutate } = useSWRConfig();
  const router = useRouter();

  const districtFetcher = async () => {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_LOCATIONS_GET_DISTRICTS!,
      {
        method: "POST",
        body: JSON.stringify({
          city_id: form.watch("city.city_id"),
        }),
      }
    );

    const response = await res.json();
    return response.result as TDistrict[];
  };

  const villagesFetcher = async () => {
    if (districtCode) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_LOCATIONS_GET_VILLAGES!,
        {
          method: "POST",
          body: JSON.stringify({
            district_code: districtCode,
          }),
        }
      );

      const response = await res.json();
      return response.result as TVillage[];
    } else {
      return [] as TVillage[];
    }
  };

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
    form.setValue("city.city_id", "");
    form.setValue("district", "");
    mutate("/api/shipping/get-cities/" + province_id);
    mutate("/api/shipping/get-districts", districtFetcher, {
      populateCache: true,
      revalidate: true,
    });
  };

  const onCityChangeHandler = (city_id: string) => {
    form.setValue("city.city_id", city_id);
    mutate("/api/shipping/get-districts", districtFetcher, {
      revalidate: true,
      rollbackOnError: false,
    });
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

  const { data: districtsData, isLoading: districtLoading } = useSWR(
    "/api/shipping/get-districts",
    districtFetcher
  );

  const [districtCode, setDistrictCode] = useState<string | null>(
    defaultAddress
      ? districtsData?.find(
          (district) => district.name === defaultAddress.district
        )?.code ?? null
      : null
  );

  const { data: villagesData, isLoading: villagesLoading } = useSWR(
    "/api/shipping/get-villages",
    villagesFetcher
  );

  const onDistrictChangeHandler = (district: string) => {
    form.setValue("district", district);

    const districtCode = districtsData?.find(
      (_district) => _district.name === district
    )?.code;
    setDistrictCode(districtCode ?? null);

    mutate("/api/shipping/get-villages", villagesFetcher, {
      revalidate: true,
      rollbackOnError: false,
    });
  };

  const onVillageChangeHandler = (village: string) => {
    form.setValue("village", village);
  };

  const onHelpModalOpen = (option: "district" | "village") => {
    setHelp({ open: true, option: option });
  };

  const onHelpModalClose = () => {
    setHelp({ open: false, option: "district" });
  };

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
            district: data.district ? data.district : "NO_DATA",
            village: data.village ? data.village : "NO_DATA",
            currentLocation: currentLocation,
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
        router.refresh();
        router.back();
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
            district: data.district ? data.district : "NO_DATA",
            village: data.village ? data.village : "NO_DATA",
            currentLocation: {
              lat: defaultAddress?.latidude ?? 0,
              long: defaultAddress?.longitude ?? 0,
            },
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

  useEffect(() => {
    if (navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!currentLocation) {
      setIsAlert(true);
    } else {
      setIsAlert(false);
    }
  }, [currentLocation]);

  return (
    <>
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
          <Label htmlFor="fullAddress">Alamat Lengkap</Label>
          <Textarea
            id="fullAddress"
            placeholder="Nama Jalan/Patokan/Nomor Rumah"
            rows={5}
            required
            {...form.register("fullAddress")}
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <Label htmlFor="province">Provinsi</Label>
          <Select
            onValueChange={(value) => onProvinceChangeHandler(value)}
            defaultValue={form.watch("city.province_id")}
            required
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
            required
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
          <div className="flex flex-row items-center gap-2">
            <Label htmlFor="city">Kecamatan</Label>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => onHelpModalOpen("district")}
            >
              <HelpCircleIcon className="w-4 h-4" />
            </Button>
          </div>
          <Select
            onValueChange={(value) => onDistrictChangeHandler(value)}
            disabled={
              !form.watch("city.city_id") ||
              districtLoading ||
              (districtsData && districtsData.length < 1)
            }
            defaultValue={form.watch("district")}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  districtsData && districtsData.length < 1
                    ? "Tidak ada data kecamatan"
                    : "Pilih Kecamatan"
                }
              />
            </SelectTrigger>

            <SelectContent className="overflow-y-auto max-h-[45vh]">
              {districtLoading ? (
                <SelectItem value="loading" disabled>
                  Memuat kecamatan...
                </SelectItem>
              ) : districtsData && districtsData.length > 0 ? (
                districtsData
                  .sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 0;
                    }
                    return 0;
                  })
                  .map((district) => (
                    <SelectItem key={district.code} value={district.name}>
                      {properizeWords(district.name)}
                    </SelectItem>
                  ))
              ) : (
                districtsData &&
                districtsData.length < 1 && (
                  <SelectItem value="NO_DATA" disabled>
                    Tidak ada data kecamatan
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row items-center gap-2">
            <Label htmlFor="city">Desa</Label>
            <Button
              variant="ghost"
              size="icon"
              type="button"
              onClick={() => onHelpModalOpen("village")}
            >
              <HelpCircleIcon className="w-4 h-4" />
            </Button>
          </div>
          <Select
            onValueChange={(value) => onVillageChangeHandler(value)}
            disabled={
              !form.watch("district") ||
              !districtCode ||
              villagesLoading ||
              (villagesData && villagesData.length < 1)
            }
            defaultValue={form.watch("village")}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  villagesData && villagesData.length < 1
                    ? "Tidak ada data desa"
                    : "Pilih Desa"
                }
              />
            </SelectTrigger>

            <SelectContent className="overflow-y-auto max-h-[45vh]">
              {villagesLoading ? (
                <SelectItem value="loading" disabled>
                  Memuat data desa...
                </SelectItem>
              ) : villagesData && villagesData.length > 0 ? (
                villagesData
                  .sort((a, b) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 0;
                    }
                    return 0;
                  })
                  .map((village) => (
                    <SelectItem key={village.code} value={village.name}>
                      {properizeWords(village.name)}
                    </SelectItem>
                  ))
              ) : (
                villagesData &&
                villagesData.length < 1 && (
                  <SelectItem value="NO_DATA" disabled>
                    Tidak ada data desa
                  </SelectItem>
                )
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

      <AddressHelpModal
        open={help.open}
        onClose={onHelpModalClose}
        option={help.option}
      />

      <Alert
        isOpen={isAlert}
        title="GPS Belum Aktif"
        message="Mohon aktifkan lokasi anda untuk mempermudah pengisian alamat."
        onConfirm={() => setIsAlert(false)}
      />
    </>
  );
}
