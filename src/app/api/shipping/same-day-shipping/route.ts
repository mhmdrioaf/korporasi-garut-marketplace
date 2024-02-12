import { NextRequest, NextResponse } from "next/server";

interface IRequestBody {
  currentLocation: {
    lat: number;
    long: number;
  };
  origin: {
    lat: number;
    long: number;
  };
}

async function handler(request: NextRequest) {
  const body: IRequestBody = await request.json();

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_SAMEDAY_SHIPPING!, {
      method: "POST",
      body: JSON.stringify({
        origins: [
          {
            latitude: body.origin.lat,
            longitude: body.origin.long,
          },
        ],
        destinations: [
          {
            latitude: body.currentLocation.lat,
            longitude: body.currentLocation.long,
          },
        ],
        travelMode: "driving",
        distanceUnit: "km",
      }),
    });

    const response = await res.json();
    const result = response.resourceSets[0].resources[0].results[0];

    return NextResponse.json({
      ok: true,
      result: {
        travelDistance: parseFloat(result.travelDistance),
        travelDuration: parseFloat(result.travelDuration),
      } as TSameDayShippingResult,
    });
  } catch (err) {
    console.error("An error occurred when getting shipping data", err);
    return NextResponse.json({
      ok: false,
      result: null,
    });
  }
}

export { handler as POST };
