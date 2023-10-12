import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Users from "@/lib/prisma-classes/User";

async function handler(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (authorization) {
    const users = new Users(db.user);
    const usersList = await users.listUser(authorization);

    if (usersList) {
      return NextResponse.json(
        { ok: true, result: usersList },
        { status: 200, statusText: "Users listed successfully." }
      );
    } else {
      return NextResponse.json(
        { ok: false, result: null },
        { status: 400, statusText: "An error occurred." }
      );
    }
  } else {
    return NextResponse.json(
      { ok: false, result: null },
      { status: 401, statusText: "You are not allowed to make this request!" }
    );
  }
}

export { handler as GET };
