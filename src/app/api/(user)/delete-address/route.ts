import { db } from "@/lib/db";
import Address from "@/lib/prisma-classes/Address";
import { NextRequest, NextResponse } from "next/server";

interface DeleteAddressBody {
  address_id: string;
}

async function handler(request: NextRequest) {
  const body: DeleteAddressBody = await request.json();

  try {
    const address = new Address(db.address, null);
    const deleteAddress = await address.deleteAddress(body.address_id);

    if (deleteAddress) {
      return NextResponse.json({
        ok: true,
        message: "Data alamat berhasil terhapus.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message:
          "Terjadi kesalahan ketika menghapus data alamat, silahkan coba lagi nanti.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message:
        "Terjadi kesalahan ketika menghapus data alamat, silahkan coba lagi nanti.",
    });
  }
}

export { handler as DELETE };
