import { TVillage } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

interface IRequestBody {
  district_code: number;
}

async function handler(request: NextRequest) {
  const body: IRequestBody = await request.json();

  try {
    const endPoint = process.env.NEXT_PUBLIC_API_LOCATIONS_ENDPOINT;
    const apiURL = `${endPoint}/api/list-villages/${body.district_code}`;
    const res = await fetch(apiURL, {
      method: "GET",
      headers: {
        key: process.env.NEXT_LOCATIONS_SECRET!,
      },
    });

    const response = await res.json();

    if (!response.ok) {
      return NextResponse.json({ ok: false, result: [] });
    } else {
      return NextResponse.json({
        ok: true,
        result: response.result as TVillage[],
      });
    }
  } catch (err) {
    console.error("An error occurred while getting villages: ", err);
    return NextResponse.json({ ok: false, result: [] });
  }
}

export { handler as POST };
