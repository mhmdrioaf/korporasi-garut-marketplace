import { db } from "@/lib/db";
import Address from "@/lib/prisma-classes/Address";
import { NextRequest, NextResponse } from "next/server";

interface IAddressBody {
  user_id: string;
  city_id: string;
  fullAddress: string;
  recipient_name: string;
  recipient_phone: string;
  label: string;
  district: string;
  village: string;
  currentLocation: {
    lat: number;
    long: number;
  } | null;
}

async function handler(request: NextRequest) {
  const body: IAddressBody = await request.json();

  const cityData = await fetch(
    `https://api.rajaongkir.com/starter/city?id=${body.city_id}`,
    {
      method: "GET",
      headers: { key: process.env.NEXT_PUBLIC_SHIPPING_TOKEN! },
    }
  );

  const city = await cityData.json();
  if (city) {
    try {
      const address = new Address(db.address, db.user);
      const newAddress = await address.addAddress({
        city: city.rajaongkir.results,
        fullAddress: body.fullAddress,
        label: body.label,
        recipientName: body.recipient_name,
        recipientPhoneNumber: body.recipient_phone,
        user_id: body.user_id,
        district: body.district,
        village: body.village,
        currentLocation: body.currentLocation,
      });

      if (newAddress) {
        return NextResponse.json({
          ok: true,
          message: "Berhasil menambahkan alamat baru.",
        });
      } else {
        return NextResponse.json({
          ok: false,
          message:
            "Telah terjadi kesalahan pada server, harap coba lagi nanti.",
        });
      }
    } catch (err) {
      console.error(err);
      return NextResponse.json({
        ok: false,
        message: "Telah terjadi kesalahan pada server, harap coba lagi nanti.",
      });
    }
  } else {
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan pada server, harap coba lagi nanti.",
    });
  }
}

export { handler as PUT };
