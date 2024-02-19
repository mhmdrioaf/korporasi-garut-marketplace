import { NextRequest, NextResponse } from "next/server";

interface IRequestBody {
  city_id: string;
}

async function handler(request: NextRequest) {
  const body: IRequestBody = await request.json();
  const { city_id } = body;

  async function getCityData(city_id: string) {
    const cityData = await fetch(
      `https://api.rajaongkir.com/starter/city?id=${city_id}`,
      {
        method: "GET",
        headers: { key: process.env.NEXT_PUBLIC_SHIPPING_TOKEN! },
      }
    );

    const city = await cityData.json();
    if (city) {
      return city.rajaongkir.results as TCity;
    } else {
      return null;
    }
  }

  try {
    const cityData = await getCityData(city_id);
    const endPoint = process.env.NEXT_PUBLIC_API_LOCATIONS_ENDPOINT;
    const apiURL = `${endPoint}/api/get-district`;

    const res = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        city: cityData?.city_name,
        type: cityData?.type,
      }),
    });

    const response = await res.json();

    if (!response.ok) {
      return NextResponse.json({ ok: false, result: [] });
    } else {
      return NextResponse.json({ ok: true, result: response.result });
    }
  } catch (err) {
    return NextResponse.json({ ok: false, result: [] });
  }
}

export { handler as POST };
