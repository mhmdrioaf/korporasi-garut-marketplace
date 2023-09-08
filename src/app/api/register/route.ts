import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
  name: string;
}

async function handler(request: NextRequest) {
  const body: RegisterRequestBody = await request.json();

  try {
    const newUser = await db.user.create({
      data: {
        email: body.email,
        username: body.username,
        password: await bcrypt.hash(body.password, 10),
        name: body.name,
      },
    });

    const { password, ...result } = newUser;
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: "Email atau username telah terdaftar." },
          {
            status: 409,
            statusText: "Email atau username telah terdaftar.",
          }
        );
      }
    }
  }
}

export { handler as POST };
