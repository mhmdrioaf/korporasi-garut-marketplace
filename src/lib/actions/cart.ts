"use server";

import { db } from "../db";
import { TCustomerCart, TCustomerCartItem } from "../globals";

export async function cartItemsQuantityChangeHandler(cart: TCustomerCart) {
  const updateQuantity = await db.customer_cart.update({
    where: {
      cart_id: cart.cart_id,
    },
    data: {
      cart_items: {
        update: cart.cart_items.map((item) => ({
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
    return updateQuantity;
  } else {
    return undefined;
  }
}

export async function cartItemDeleteHandler(cartItem: TCustomerCartItem) {
  const deleteItem = await db.customer_cart.update({
    where: {
      cart_id: cartItem.cart_id,
    },
    data: {
      cart_items: {
        delete: {
          cart_item_id: cartItem.cart_item_id,
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
    return deleteItem;
  } else {
    return undefined;
  }
}
