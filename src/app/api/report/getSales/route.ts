import { db } from "@/lib/db";
import { permissionHelper } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface IGetSalesRequest {
  token: string;
  startDate: string;
  endDate: string;
}

async function handler(request: NextRequest) {
  const body: IGetSalesRequest = await request.json();

  if (permissionHelper(body.token, process.env.NEXT_PUBLIC_ADMIN_TOKEN!)) {
    try {
      const ordersData: TSalesReportData[] = await db.orders.findMany({
        where: {
          AND: [
            {
              order_date: {
                gte: new Date(body.startDate),
                lte: new Date(body.endDate),
              },
            },
            {
              OR: [
                {
                  order_status: "FINISHED",
                },
                {
                  order_status: "DELIVERED",
                },
              ],
            },
          ],
        },
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
    console.error("Anda tidak mempunyai akses untuk melakukan permintaan ini!");
    return NextResponse.json({ ok: false, data: null });
  }
}

export { handler as POST };
