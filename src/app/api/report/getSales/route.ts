import { db } from "@/lib/db";
import { permissionHelper } from "@/lib/helper";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(_request: NextRequest) {
  const headersList = headers();
  const key = headersList.get("key");

  if (key) {
    if (permissionHelper(key, process.env.NEXT_PUBLIC_ADMIN_TOKEN!)) {
      try {
        const ordersData: TSalesReportData[] = await db.orders.findMany({
          include: {
            user: {
              select: {
                user_id: true,
                account: {
                  select: {
                    user_name: true,
                  },
                },
              },
            },
            order_item: {
              select: {
                order_quantity: true,
                product: {
                  select: {
                    id: true,
                    images: true,
                    price: true,
                    title: true,
                    unit: true,
                    visitor: true,
                    cart_count: true,
                    search_count: true,
                    seller: {
                      select: {
                        user_id: true,
                        account: {
                          select: {
                            user_name: true,
                          },
                        },
                      },
                    },
                  },
                },
                variant: {
                  select: {
                    variant_item_id: true,
                    variant_name: true,
                    variant_price: true,
                    variant: {
                      select: {
                        product: {
                          select: {
                            seller_id: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (ordersData) {
          return NextResponse.json({ ok: true, data: ordersData });
        } else {
          return NextResponse.json({ ok: false, data: null });
        }
      } catch (error) {
        console.error(
          "Terjadi kesalahan ketika mendapatkan data penjualan: ",
          error
        );
        return NextResponse.json({ ok: false, data: null });
      }
    } else {
      console.error(
        "Anda tidak mempunyai akses untuk melakukan permintaan ini!"
      );
      return NextResponse.json({ ok: false, data: null });
    }
  } else {
    console.error("Anda tidak mempunyai akses untuk melakukan permintaan ini!");
    return NextResponse.json({ ok: false, data: null });
  }
}

export { handler as GET };
