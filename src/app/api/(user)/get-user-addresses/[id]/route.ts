import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { USER_ADDRESS } from "@/lib/constants";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const userAddress = USER_ADDRESS.filter(
    (address) => address.user_id === parseInt(params.id)
  );

  if (userAddress) {
    return NextResponse.json({ ok: true, result: userAddress });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
