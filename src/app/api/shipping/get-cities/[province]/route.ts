import { TCity } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { province: string } }
) {
  const key = request.headers.get("key");
  const provinceID = params.province;

  if (!key) {
    return NextResponse.json({ ok: false, message: "No key provided" });
  } else {
    try {
      const citiesData = await fetch(
        `https://api.rajaongkir.com/starter/city?province=${provinceID}`,
        {
          method: "GET",
          headers: { key: key },
        }
      );

      const cities = await citiesData.json();
      if (cities) {
        return NextResponse.json({
          ok: true,
          data: cities.rajaongkir.results as TCity[],
        });
      } else {
        return NextResponse.json({
          ok: false,
          message: "An error occurred when fetching cities data",
        });
      }
    } catch (error) {
      return NextResponse.json({
        ok: false,
        message: "An error occurred when fetching cities data: " + error,
      });
    }
  }
}

export { handler as GET };
