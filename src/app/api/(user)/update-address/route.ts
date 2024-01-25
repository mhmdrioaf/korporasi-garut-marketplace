import { db } from "@/lib/db";
import Address from "@/lib/prisma-classes/Address";
import { NextRequest, NextResponse } from "next/server";

interface IUpdateAddressBody {
  address_id: string;
  user_id: string;
  city_id: string;
  fullAddress: string;
  recipientName: string;
  recipientPhoneNumber: string;
  label: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
}

async function handler(request: NextRequest) {
  const body: IUpdateAddressBody = await request.json();

  const cityData = await fetch(
    `https://api.rajaongkir.com/starter/city?id=${body.city_id}`,
    {
      method: "GET",
      headers: { key: process.env.NEXT_PUBLIC_SHIPPING_TOKEN! },
    }
  );

  const city = await cityData.json();

  try {
    const address = new Address(db.address, null);
    const updateAddress = await address.updateAddress({
      address_id: body.address_id,
      city: city.rajaongkir.results,
      fullAddress: body.fullAddress,
      label: body.label,
      recipientName: body.recipientName,
      recipientPhoneNumber: body.recipientPhoneNumber,
      user_id: body.user_id,
      district: body.district,
      village: body.village,
      currentLocation: {
        lat: body.latitude,
        long: body.longitude,
      },
    });

    if (updateAddress) {
      return NextResponse.json({
        ok: true,
        message: "Data alamat berhasil di ubah.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message:
          "Data alamat gagal di ubah, hubungi developer untuk memperbaiki hal ini.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message:
        "Data alamat gagal di ubah, hubungi developer untuk memperbaiki hal ini.",
    });
  }
}

export { handler as PATCH };
