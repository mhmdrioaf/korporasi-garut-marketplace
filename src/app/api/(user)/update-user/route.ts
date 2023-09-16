import { db } from "@/lib/db";
import { phoneNumberGenerator, properizeWords } from "@/lib/helper";
import Users from "@/lib/prisma-classes/User";
import { NextRequest, NextResponse } from "next/server";

interface UpdateUserBody {
  dataToChange: string;
  dataValue: string;
  username: string;
}

async function handler(request: NextRequest) {
  const body: UpdateUserBody = await request.json();

  try {
    const valueToSubmit =
      body.dataToChange === "name"
        ? properizeWords(body.dataValue)
        : body.dataToChange === "username"
        ? body.dataValue.toLowerCase()
        : phoneNumberGenerator(body.dataValue);
    const users = new Users(db.user);
    const updateUser = await users.updateUser(
      body.dataToChange,
      valueToSubmit,
      body.username
    );
    return NextResponse.json({
      ok: updateUser.status === "success",
      message: updateUser.message,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan pada server, silahkan coba lagi nanti.",
    });
  }
}

export { handler as PATCH };
