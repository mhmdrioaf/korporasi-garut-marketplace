import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Users from "@/lib/prisma-classes/User";

interface ILoginRequestBody {
  username: string;
  password: string;
}

async function handler(request: NextRequest) {
  const body: ILoginRequestBody = await request.json();

  const users = new Users(db.user);
  const user = await users.login(body);

  return new NextResponse(JSON.stringify(user));
}

export { handler as POST };
