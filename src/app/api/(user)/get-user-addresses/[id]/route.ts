import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Address from "@/lib/prisma-classes/Address";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const userAddressData = new Address(null, db.user);
  const userAddress = await userAddressData.listAddresses(params.id);

  if (userAddress) {
    return NextResponse.json({
      ok: true,
      result: userAddress,
      requestTime: date,
    });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
