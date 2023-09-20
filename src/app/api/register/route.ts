import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import Users from "@/lib/prisma-classes/User";

interface RegisterRequestBody {
  phone_number: string;
  name: string;
  username: string;
  email: string;
  password: string;
}

async function handler(request: NextRequest) {
  const body: RegisterRequestBody = await request.json();

  try {
    const users = new Users(db.user);
    const newUser = await users.register(body);

    if (newUser) {
      return NextResponse.json(
        {
          ok: true,
          message: "Proses pendaftaran berhasil.",
        },
        {
          status: 200,
          statusText: "Proses pendaftaran berhasil.",
        }
      );
    } else {
      return NextResponse.json(
        {
          ok: false,
          message: "Proses pendaftaran gagal, silahkan coba lagi nanti.",
        },
        {
          status: 409,
          statusText: "Unknown error occurred.",
        }
      );
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return NextResponse.json(
          { error: err.meta?.target },
          {
            status: 409,
            statusText: `${err.meta?.target} telah terdaftar`,
          }
        );
      } else {
        return NextResponse.json(
          {
            error: "Telah terjadi kesalahan.",
          },
          {
            status: 409,
            statusText: err.message,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          error: "Telah terjadi kesalahan...",
        },
        {
          status: 500,
          statusText: "Unknown error occurred.",
        }
      );
    }
  }
}

export { handler as PUT };