import { db } from "@/lib/db";
import { phoneNumberGenerator, properizeWords } from "@/lib/helper";
import Users from "@/lib/prisma-classes/User";
import { NextRequest, NextResponse } from "next/server";

interface IUpdateUserBody {
  dataToChange: string;
  dataValue: string | null;
  userId: string;
}

async function handler(request: NextRequest) {
  const body: IUpdateUserBody = await request.json();

  try {
    const valueToSubmit =
      body.dataToChange === "name"
        ? properizeWords(body.dataValue!)
        : body.dataToChange === "username"
        ? body.dataValue!.toLowerCase()
        : body.dataToChange === "phone_number"
        ? phoneNumberGenerator(body.dataValue!)
        : body.dataValue;
    const users = new Users(db.user);
    const updateUser = await users.updateUser(
      body.dataToChange,
      valueToSubmit,
      body.userId
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
