import { TCustomerCart, TCustomerCartItem } from "../globals";

export async function cartItemsQuantityChangeHandler(cart: TCustomerCart) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_CART_QUANTITY!, {
    method: "PATCH",
    body: JSON.stringify({
      cart: cart,
    }),
  });

  const response = await res.json();

  if (!response.ok) {
    return undefined;
  } else {
    return response.result as TCustomerCart;
  }
}

export async function cartItemDeleteHandler(cartItem: TCustomerCartItem) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_CART_DELETE!, {
    method: "PATCH",
    body: JSON.stringify({
      cart_item: cartItem,
    }),
  });

  const response = await res.json();

  if (!response.ok) {
    return undefined;
  } else {
    return response.result as TCustomerCart;
  }
}
