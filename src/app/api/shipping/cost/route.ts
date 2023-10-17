import { NextRequest, NextResponse } from "next/server";

interface IShippingCostBody {
  origin: string;
  destination: string;
  weight: number;
}

interface TShippingCostRequest extends IShippingCostBody {
  courier: string;
}

async function handler(request: NextRequest) {
  const body: IShippingCostBody = await request.json();
  const { origin, destination, weight } = body;

  const shippingCostRequest: TShippingCostRequest = {
    origin: origin,
    destination: destination,
    weight: weight,
    courier: "jne",
  };

  const shippingCostForm = Object.keys(shippingCostRequest)
    .map(
      (key) =>
        encodeURIComponent(key) +
        "=" +
        encodeURIComponent(
          shippingCostRequest[key as keyof TShippingCostRequest]
        )
    )
    .join("&");

  try {
    const res = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        key: process.env.NEXT_PUBLIC_SHIPPING_TOKEN!,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: shippingCostForm,
    });

    const response = await res.json();

    if (response) {
      return NextResponse.json({
        ok: true,
        result: response.rajaongkir.results,
      });
    } else {
      return NextResponse.json({ ok: false });
    }
  } catch (error) {
    console.error(
      "An error occurred while getting shipping cost data: ",
      error
    );
    return NextResponse.json({ ok: false });
  }
}

export { handler as POST };
