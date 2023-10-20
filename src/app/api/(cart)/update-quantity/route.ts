import { db } from "@/lib/db";
import { TCustomerCart } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

interface IUpdateQuantityRequestBody {
  cart: TCustomerCart;
}

async function handler(request: NextRequest) {
  const body: IUpdateQuantityRequestBody = await request.json();

  try {
    const updateQuantity = await db.customer_cart.update({
      where: {
        cart_id: body.cart.cart_id,
      },
      data: {
        cart_items: {
          update: body.cart.cart_items.map((item) => ({
            where: {
              cart_item_id: item.cart_item_id,
            },
            data: {
              quantity: {
                set: item.quantity,
              },
            },
          })),
        },
      },
      include: {
        cart_items: {
          include: {
            product: {
              include: {
                seller: {
                  select: {
                    address: {
                      select: {
                        city: true,
                        address_id: true,
                      },
                    },
                    account: {
                      select: {
                        user_name: true,
                      },
                    },
                    user_id: true,
                    primary_address_id: true,
                  },
                },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (updateQuantity) {
      return NextResponse.json({ ok: true, result: updateQuantity });
    } else {
      return NextResponse.json({ ok: false });
    }
  } catch (error) {
    console.error(
      "An error occurred while updating item cart quantity: ",
      error
    );
    return NextResponse.json({ ok: false });
  }
}

export { handler as PATCH };
