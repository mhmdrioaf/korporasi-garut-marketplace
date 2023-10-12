import { db } from "@/lib/db";
import Users from "@/lib/prisma-classes/User";
import { NextRequest, NextResponse } from "next/server";

interface IDisableUserRequestBody {
  username: string;
  isDeactivate: boolean;
}

async function handler(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const body: IDisableUserRequestBody = await request.json();
  const statusText = body.isDeactivate ? "menonaktifkan" : "mengaktifkan";
  try {
    if (!authorization) {
      return NextResponse.json({
        ok: false,
        message: "Anda tidak mempunyai akses untuk melakukan permintaan ini!",
      });
    } else {
      const users = new Users(db.user);
      const disableUser = await users.disableUser(
        authorization,
        body.username,
        body.isDeactivate
      );
      if (disableUser) {
        return NextResponse.json({
          ok: true,
          message: `Akun pengguna berhasil di ${
            body.isDeactivate ? "di nonaktifkan" : "di aktifkan"
          }.`,
        });
      } else {
        return NextResponse.json({
          ok: false,
          message:
            "Telah terjadi kesalahan pada server ketika melakukan permintaan ini, silahkan coba lagi nanti atau hubungi developer jika masalah ini berlanjut.",
        });
      }
    }
  } catch (error) {
    console.error(
      `Terjadi kesalahan ketika ${statusText} akun pengguna:`,
      error
    );
    return NextResponse.json({
      ok: false,
      message:
        "Telah terjadi kesalahan pada server ketika melakukan permintaan ini, silahkan coba lagi nanti atau hubungi developer jika masalah ini berlanjut.",
    });
  }
}

export { handler as PATCH };
