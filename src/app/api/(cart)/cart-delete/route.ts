import { db } from "@/lib/db";
import { TCustomerCartItem } from "@/lib/globals";
import { NextRequest, NextResponse } from "next/server";

interface ICartUpdateBody {
  cart_item: TCustomerCartItem;
}

async function handler(request: NextRequest) {
  const body: ICartUpdateBody = await request.json();

  try {
    const deleteItem = await db.customer_cart.update({
      where: {
        cart_id: body.cart_item.cart_id,
      },
      data: {
        cart_items: {
          delete: {
            cart_item_id: body.cart_item.cart_item_id,
          },
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

    if (deleteItem) {
      return NextResponse.json({ ok: true, result: deleteItem });
    } else {
      return NextResponse.json({ ok: false });
    }
  } catch (error) {
    console.error(
      "An error occurred while updating deleting cart item: ",
      error
    );
    return NextResponse.json({ ok: false });
  }
}

export { handler as PATCH };
