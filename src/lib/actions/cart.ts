"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import Carts from "../prisma-classes/Carts";

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
    revalidatePath("/user/cart");
    return deleteItem;
  } else {
    return undefined;
  }
}

export async function addToCart(props: {
  user_id: string;
  product: TProduct;
  product_variant: TProductVariantItem | null;
  product_quantity: number;
}) {
  const carts = new Carts(db.customer_cart, db.customer_cart_item);
  const addNewCart = await carts.initializeCart(props);

  const updateProductCartCount = await db.product.update({
    where: {
      id: props.product.id,
    },
    data: {
      cart_count: {
        increment: props.product_quantity,
      },
    },
  });

  if (updateProductCartCount) {
    revalidatePath("/");
    return addNewCart;
  } else {
    return {
      ok: false,
      message: "Gagal menambahkan item ke keranjang",
    };
  }
}
