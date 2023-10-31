"use client";

import {
  TAddress,
  TCustomerCart,
  TCustomerCartItem,
  TUser,
} from "@/lib/globals";
import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { TCartContext } from "./cartContextType";
import { Button } from "@/components/ui/button";
import {
  MinusCircleIcon,
  MinusIcon,
  PlusCircleIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { CheckedState } from "@radix-ui/react-checkbox";
import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import {
  cartItemDeleteHandler,
  cartItemsQuantityChangeHandler,
} from "@/lib/actions/cart";
import { useToast } from "@/components/ui/use-toast";

interface ICartContextProps {
  children: ReactNode;
  user_id: string;
}

interface IProductsBySeller {
  [sellerId: number]: { [cartItemId: string]: TCustomerCartItem };
}

export const CartContext = createContext<TCartContext | null>(null);

export function useCart() {
  return useContext(CartContext) as TCartContext;
}

export function CartProvider({ user_id, children }: ICartContextProps) {
  const [checkedItems, setCheckedItems] = useState<IProductsBySeller>({});
  const [isDelete, setIsDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TCustomerCartItem | null>(
    null
  );

  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
    mutate,
  } = useSWR("/api/cart-list", (url) =>
    fetch(url, {
      headers: {
        user_id: user_id,
      },
    })
      .then((res) => res.json())
      .then((res) => res.result as TCustomerCart)
  );

  const sellerAddress = (sellerID: number) => {
    if (!cartData) {
      console.error("Tidak ada data keranjang");
    } else {
      const cartItem = cartData.cart_items.find(
        (item) => item.product.seller.user_id === sellerID
      );
      const seller = cartItem ? cartItem.product.seller : null;
      if (seller) {
        const sellerPrimaryAddress = seller.address.find(
          (address) => address.address_id === seller.primary_address_id
        );
        return sellerPrimaryAddress
          ? sellerPrimaryAddress.city.city_name
          : "Tidak diketahui";
      }
    }
  };

  const { toast } = useToast();

  const itemRef = useRef<(HTMLButtonElement | null)[]>([]);

  const onItemCardClick = (index: number) => {
    if (itemRef.current[index]) {
      itemRef.current[index]?.click();
    }
  };

  const onItemChecked = (
    checked: CheckedState,
    item: TCustomerCartItem,
    sellerId: number
  ) => {
    setCheckedItems((prevCheckedItems) => {
      const sellerItems = { ...(prevCheckedItems[sellerId] || {}) };
      const cartItemId = Number(
        item.cart_item_id.slice(
          item.cart_item_id.length - 5,
          item.cart_item_id.length
        )
      );

      if (!checked) {
        delete sellerItems[cartItemId];
      } else {
        sellerItems[cartItemId] = item;
      }

      return { ...prevCheckedItems, [sellerId]: sellerItems };
    });
  };

  const calculateTotalPrice = (item: TCustomerCartItem) => {
    const productPrice = item.product.price;
    const variantPrice = item.variant?.variant_price ?? 0;
    const totalPrice = variantPrice > 0 ? variantPrice : productPrice;

    return totalPrice;
  };

  const calculateTotalCheckedItems = () => {
    let totalCheckedItems = 0;

    for (const sellerId in checkedItems) {
      const items = checkedItems[sellerId];

      for (const cartItemId in items) {
        const cartItem = items[cartItemId];
        totalCheckedItems += cartItem.quantity;
      }
    }

    return totalCheckedItems;
  };

  const calculateCheckedItemsPrice = () => {
    let totalPrice = 0;

    for (const sellerId in checkedItems) {
      for (const cartItemId of Object.keys(checkedItems[sellerId])) {
        const cartItem = checkedItems[sellerId][cartItemId];
        const product = cartItem.product;
        const variant = cartItem.variant;
        const quantity = cartItem.quantity;

        if (variant) {
          totalPrice += variant.variant_price * quantity;
        } else {
          totalPrice += product.price * quantity;
        }
      }
    }

    return totalPrice;
  };

  function getSellerName(sellerId: number) {
    if (!cartData) {
      return "Tidak diketahui";
    } else {
      const sellerProduct = cartData.cart_items.find(
        (item) => item.product.seller.user_id === sellerId
      );
      const sellerName = sellerProduct?.product.seller.account.user_name;

      return sellerName ?? "Tidak diketahui";
    }
  }

  function groupCartItemsBySeller(): {
    [sellerId: number]: TCustomerCartItem[];
  } | null {
    const groupedCartItems: { [sellerId: number]: TCustomerCartItem[] } = {};

    if (cartData) {
      for (const cartItem of cartData.cart_items) {
        const sellerId = cartItem.product.seller.user_id;

        if (!groupedCartItems[sellerId]) {
          groupedCartItems[sellerId] = [];
        }

        groupedCartItems[sellerId].push(cartItem);
      }

      return groupedCartItems;
    } else {
      return null;
    }
  }

  async function onQuantityChange(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: TCustomerCartItem,
    options: "decrease" | "increase"
  ) {
    event.preventDefault();
    if (!cartData) {
      console.error("Data keranjang tidak ditemukan!");
    } else {
      let currentItem = item;
      let _currentCart = cartData!;
      const clearedItems = _currentCart.cart_items.filter(
        (current) => current !== item
      );

      switch (options) {
        case "decrease":
          if (currentItem.quantity > 1) {
            currentItem.quantity += -1;
            break;
          } else {
            currentItem.quantity = 1;
            break;
          }
        case "increase":
          currentItem.quantity += 1;
          break;
      }

      const itemIndex = cartData!.cart_items.findIndex(
        (current) => current === item
      );
      const updatedItems = [
        ...clearedItems.slice(0, itemIndex),
        currentItem,
        ...clearedItems.slice(itemIndex),
      ];
      _currentCart.cart_items = updatedItems;
      setCheckedItems((prev) => {
        const sellerId = item.product.seller.user_id;
        const sellerItem = { ...(prev[sellerId] || {}) };
        const cartItemId = Number(
          item.cart_item_id.slice(
            item.cart_item_id.length - 5,
            item.cart_item_id.length
          )
        );

        if (sellerItem[cartItemId]) {
          sellerItem[cartItemId] = item;
        }

        return { ...prev, [sellerId]: sellerItem };
      });

      try {
        await mutate(cartItemsQuantityChangeHandler(_currentCart), {
          optimisticData: _currentCart,
          populateCache: true,
          rollbackOnError: true,
          revalidate: false,
        });
        calculateCheckedItemsPrice();
      } catch (error) {
        console.error(
          "An error occurred while changing item quantity: ",
          error
        );
      }
    }
  }

  async function onCartItemDelete() {
    if (!cartData) {
      console.error("Data keranjang tidak ditemukan");
    } else if (!itemToDelete) {
      console.error("Data item untuk di hapus tidak tersedia.");
    } else {
      setIsLoading(true);
      let currentCart = cartData;
      const updatedItems = currentCart.cart_items.filter(
        (item) => item !== itemToDelete
      );
      currentCart.cart_items = updatedItems;

      try {
        await mutate(cartItemDeleteHandler(itemToDelete), {
          optimisticData: currentCart,
          populateCache: true,
          rollbackOnError: true,
          revalidate: false,
        });
        setIsLoading(false);
        setIsDelete(false);
        setItemToDelete(null);
        toast({
          variant: "success",
          title: "Berhasil menghapus produk dari keranjang",
        });
      } catch (error) {
        console.error("An error occurred while deleteing cart item: ", error);
      }
    }
  }

  function onDeleteButtonClicked(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    deletedItem: TCustomerCartItem
  ) {
    event.preventDefault();
    setIsDelete(true);
    setItemToDelete(deletedItem);
  }

  const values: TCartContext = {
    cartItems: {
      checkbox: itemRef,
      checkedItemsCount: calculateTotalCheckedItems(),
      checkedItemsPrice: calculateCheckedItemsPrice(),
      isDelete: isDelete,
      setIsDelete: setIsDelete,
      isLoading: isLoading,

      handler: {
        cardChecked: onItemChecked,
        cardClick: onItemCardClick,
        quantityChange: onQuantityChange,
        delete: onCartItemDelete,
      },
    },
    currentCart: cartData!,
    cart: {
      data: cartData,
      error: cartError,
      loading: cartError,
      items: groupCartItemsBySeller(),
      itemRefs: itemRef,
      itemPrice: calculateTotalPrice,

      handler: {
        deleteItem: onDeleteButtonClicked,
        getSellerAddress: sellerAddress,
        getSellerName: getSellerName,
        itemQuantityChange: onQuantityChange,
      },
    },
  };

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
