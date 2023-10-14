import { TProvince } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const key = request.headers.get("key");
  if (!key) {
    return NextResponse.json({ ok: false, message: "No key provided" });
  } else {
    try {
      const provincesData = await fetch(
        "https://api.rajaongkir.com/starter/province",
        {
          method: "GET",
          headers: { key: key },
        }
      );

      const provinces = await provincesData.json();
      if (provinces) {
        return NextResponse.json({
          ok: true,
          data: provinces.rajaongkir.results as TProvince[],
        });
      } else {
        return NextResponse.json({
          ok: false,
          message: "An error occurred when fetching provinces data",
        });
      }
    } catch (error) {
      return NextResponse.json({
        ok: false,
        message: "An error occurred when fetching provinces data: " + error,
      });
    }
  }
}

export { handler as GET };
