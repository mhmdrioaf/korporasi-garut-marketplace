import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Users from "@/lib/prisma-classes/User";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const users = new Users(db.user);
  const userDetail = await users.getUserDetail(params.id);

  if (userDetail) {
    return NextResponse.json({
      ok: true,
      result: userDetail,
      requestTime: date,
    });
  } else {
    return NextResponse.json({ ok: false, result: null, requestTime: date });
  }
}

export { handler as GET };
