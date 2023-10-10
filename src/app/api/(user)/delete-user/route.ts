import { db } from "@/lib/db";
import Users from "@/lib/prisma-classes/User";
import { NextRequest, NextResponse } from "next/server";

interface IUserDeleteBody {
  username: string;
}

async function handler(request: NextRequest) {
  const body: IUserDeleteBody = await request.json();

  const users = new Users(db.user);
  const deleteUser = await users.deleteUser(body.username);

  if (deleteUser.status === "success") {
    return NextResponse.json({ ok: true, message: deleteUser.message });
  } else {
    return NextResponse.json({ ok: false, message: deleteUser.message });
  }
}

export { handler as DELETE };
