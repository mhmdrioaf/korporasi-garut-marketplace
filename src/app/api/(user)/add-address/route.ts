import { db } from "@/lib/db";
import Address from "@/lib/prisma-classes/Address";
import { NextRequest, NextResponse } from "next/server";

interface IAddressBody {
  user_id: string;
  city: string;
  fullAddress: string;
  recipientName: string;
  recipientPhoneNumber: string;
  label: string;
}

async function handler(request: NextRequest) {
  const body: IAddressBody = await request.json();

  try {
    const address = new Address(db.address, db.user);
    const newAddress = await address.addAddress(body);

    if (newAddress) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil menambahkan alamat baru.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Telah terjadi kesalahan pada server, harap coba lagi nanti.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan pada server, harap coba lagi nanti.",
    });
  }
}

export { handler as PUT };
