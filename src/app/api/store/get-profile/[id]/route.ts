import { db } from "@/lib/db";
import { TSellerProfile } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sellerID = params.id;

  try {
    const seller = await db.user.findUnique({
      where: {
        user_id: parseInt(sellerID),
      },
      select: {
        account: true,
        products: {
          include: {
            variant: {
              include: {
                variant_item: true,
              },
            },
            seller: {
              select: {
                address: {
                  include: {
                    city: true,
                  },
                },
                primary_address_id: true,
              },
            },
          },
        },
        address: {
          include: {
            city: true,
          },
        },
        primary_address_id: true,
        email: true,
      },
    });

    if (seller) {
      return NextResponse.json({
        ok: true,
        result: seller as unknown as TSellerProfile,
      });
    } else {
      return NextResponse.json({ ok: false, result: null });
    }
  } catch (err) {
    console.error("Terjadi kesalahan ketika mendapatkan data penjual: ", err);
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
