import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { db } from "@/lib/db";

interface LoginRequestBody {
  username: string;
  password: string;
}

async function handler(request: NextRequest) {
  const body: LoginRequestBody = await request.json();

  const user = await db.user.findFirst({
    where: {
      OR: [
        {
          username: {
            equals: body.username,
          },
        },
        {
          email: {
            equals: body.username,
          },
        },
      ],
    },
  });

  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...result } = user;
    return new NextResponse(
      JSON.stringify(result, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      ),
      { status: 200 }
    );
  } else {
    return new NextResponse(JSON.stringify(null), { status: 400 });
  }
}

export { handler as POST };
