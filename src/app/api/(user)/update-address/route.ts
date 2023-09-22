import { db } from "@/lib/db";
import Address from "@/lib/prisma-classes/Address";
import { NextRequest, NextResponse } from "next/server";

interface IUpdateAddressBody {
  address_id: string;
  user_id: string;
  city: string;
  fullAddress: string;
  recipientName: string;
  recipientPhoneNumber: string;
  label: string;
}

async function handler(request: NextRequest) {
  const body: IUpdateAddressBody = await request.json();

  try {
    const address = new Address(db.address, null);
    const updateAddress = await address.updateAddress(body);

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
