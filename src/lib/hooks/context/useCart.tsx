"use client";

import {
  TAddress,
  TCustomerCart,
  TCustomerCartItem,
  TShippingCost,
  TShippingCostServiceCost,
} from "@/lib/globals";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ICourierBySeller,
  IProductsBySeller,
  ITotalCostBySeller,
  TCartContext,
} from "./cartContextType";
import { CheckedState } from "@radix-ui/react-checkbox";
import { fetcher } from "@/lib/helper";
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

  const [checkoutStep, setCheckoutStep] = useState<number | null>(null);
  const [chosenAddress, setChosenAddress] = useState<TAddress | null>(null);
  const [chosenCourier, setChosenCourier] = useState<ICourierBySeller>({});

  const [isOrdering, setIsOrdering] = useState<boolean>(false);
  const [isPreOrder, setIsPreOrder] = useState<boolean>(false);

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

  const { data: userData, isLoading: userLoading } = useSWR(
    "/api/get-detail/" + user_id,
    fetcher
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

  const calculcateCheckoutItemPrice = (item: TCustomerCartItem) => {
    const productPrice = item.product.price;
    const variantPrice = item.variant?.variant_price ?? 0;
    const productQuantity = item.quantity;

    if (variantPrice > 0) {
      return productQuantity * variantPrice;
    } else {
      return productQuantity * productPrice;
    }
  };

  const onAddressChoose = (chosenAddress: TAddress) => {
    setChosenAddress(chosenAddress);
    setCheckoutStep(2);
  };

  const checkoutItems = useCallback(() => {
    const cartItems: { [sellerId: number]: TCustomerCartItem[] } = {};
    for (const seller in checkedItems) {
      const items = checkedItems[seller];

      for (const itemId in items) {
        const _cartItem = items[itemId];

        if (!cartItems[seller]) {
          cartItems[seller] = [];
        }

        cartItems[seller].push(_cartItem);
      }
    }

    return cartItems;
  }, [checkedItems]);

  const totalCost = useCallback(() => {
    const items = checkoutItems();
    const sellers = Object.keys(items);
    let total = 0;

    sellers.forEach((sellerID) => {
      const sellerItems = items[parseInt(sellerID)];
      const itemsPrice = sellerItems.reduce(
        (acc, curr) =>
          curr.variant
            ? acc + curr.variant.variant_price * curr.quantity
            : acc + curr.product.price * curr.quantity,
        0
      );

      const courier = chosenCourier && chosenCourier[parseInt(sellerID)];
      const sellerShippingCourier = courier
        ? Object.keys(chosenCourier[parseInt(sellerID)])
        : null;
      const shippingPrice = sellerShippingCourier
        ? parseInt(sellerShippingCourier[0])
        : 0;

      const totalPrice = itemsPrice + shippingPrice;

      total += totalPrice;
    });

    return total;
  }, [chosenCourier, checkoutItems]);

  const checkedItemsSellers = Object.keys(checkoutItems());

  const totalSellerCost = () => {
    const items = checkoutItems();
    let _totalSellerCost: ITotalCostBySeller = {};
    for (const sellerID of checkedItemsSellers) {
      const sellerName = getSellerName(parseInt(sellerID));
      const sellerItems = items[parseInt(sellerID)];
      const itemsPrice = sellerItems.reduce(
        (acc, curr) =>
          curr.variant
            ? acc + curr.variant.variant_price * curr.quantity
            : acc + curr.product.price * curr.quantity,
        0
      );
      const isCourierChosen =
        chosenCourier && chosenCourier[parseInt(sellerID)];
      const chosenSellerCourier = isCourierChosen
        ? Object.keys(chosenCourier[parseInt(sellerID)])
        : null;
      const shippingCost = chosenSellerCourier
        ? parseInt(chosenSellerCourier[0])
        : 0;

      if (!_totalSellerCost[parseInt(sellerID)]) {
        const sellerCostValue = {
          itemsCost: itemsPrice,
          sellerName: sellerName,
          shippingCost: shippingCost,
        };

        _totalSellerCost[parseInt(sellerID)] = sellerCostValue;
      }
    }
    return _totalSellerCost;
  };

  const calculateShippingCost = async (
    sellerAddress: TAddress,
    totalWeight: number
  ) => {
    if (!chosenAddress) return null;
    try {
      const res = await fetch("/api/shipping/cost", {
        method: "POST",
        body: JSON.stringify({
          origin: sellerAddress.city.city_id,
          destination: chosenAddress.city.city_id,
          weight: totalWeight,
        }),
        cache: "no-store",
      });

      const response = await res.json();
      if (response.ok) {
        return response.result as TShippingCost[];
      } else {
        return null;
      }
    } catch (error) {
      console.error(
        "Terjadi kesalahan ketika menghitung ongkos kirim: ",
        error
      );
      return null;
    }
  };

  const calculateTotalWeight = (items: TCustomerCartItem[]) => {
    return items.reduce(
      (acc, curr) => acc + curr.product.weight * curr.quantity,
      0
    );
  };

  const onCourierChangeHandler = (
    sellerId: number,
    courier: TShippingCostServiceCost
  ) => {
    setChosenCourier((prev) => ({
      ...prev,
      [sellerId]: {
        [courier.value]: courier,
      },
    }));
  };

  const resetCheckoutState = () => {
    setChosenAddress(null);
    setChosenCourier({});
    setCheckoutStep(null);
  };

  const onCheckoutStepChanges = (value: number | null) => {
    if (value === 1) {
      setChosenCourier({});
    }

    setCheckoutStep(value);
  };

  const totalChosenCourier = useCallback(() => {
    if (chosenCourier) {
      return Object.keys(chosenCourier).length;
    } else {
      return 0;
    }
  }, [chosenCourier]);

  const totalCheckedSeller = useCallback(() => {
    const items = checkoutItems();
    if (items) {
      return Object.keys(items).length;
    } else {
      return 0;
    }
  }, [checkoutItems]);

  const onCheckout = async () => {
    setIsOrdering(true);

    if (!chosenAddress) {
      toast({
        variant: "destructive",
        title: "Anda belum memilih alamat untuk pengiriman.",
        description: "Harap ulangi dan pilih alamat untuk pengiriman.",
      });
      return new Error("Alamat pengiriman tidak ditemukan.");
    }

    let totalShippingCost: number = 0;
    let items: TCustomerCartItem[] = [];

    checkedItemsSellers.forEach((sellerID) => {
      const _items = checkoutItems();
      const sellerItems = _items[parseInt(sellerID)];
      const courier = chosenCourier && chosenCourier[parseInt(sellerID)];
      const sellerShippingCourier = courier
        ? Object.keys(chosenCourier[parseInt(sellerID)])
        : null;
      const shippingPrice = sellerShippingCourier
        ? parseInt(sellerShippingCourier[0])
        : 0;

      totalShippingCost += shippingPrice;
      sellerItems.forEach((item) => items.push(item));
    });

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_CART_CHECKOUT!, {
        method: "POST",
        body: JSON.stringify({
          items: items,
          total_price: totalCost(),
          total_shipping_cost: totalShippingCost,
          customer_id: user_id,
          shipping_address: chosenAddress.address_id,
          isPreorder: isPreOrder,
        }),
      });

      const response = await res.json();
      if (!response.ok) {
        setIsOrdering(false);
        toast({
          variant: "destructive",
          title: "Gagal melakukan pemesanan.",
          description: response.message,
        });
      } else {
        setIsOrdering(false);
        toast({
          variant: "success",
          title: "Berhasil melakukan pemesanan.",
          description: response.message,
        });
        onCheckoutStepChanges(3);
      }
    } catch (error) {
      setIsOrdering(false);
      console.error("Error terjadi ketika membuat pesanan: ", error);
    }
  };

  useEffect(() => {
    if (checkedItems) {
      let _isPreorder: boolean[] = [];
      for (let sellerId in checkedItems) {
        const sellerID = parseInt(sellerId);
        for (let cartItemId in checkedItems[sellerID]) {
          const cartItem = checkedItems[sellerID][cartItemId];
          const variant = cartItem.variant;
          const quantity = cartItem.quantity;

          if (variant) {
            const pendingOrder = variant.pending_order_count;
            const stock = variant.variant_stock;

            const preOrder = pendingOrder + quantity > stock || stock === 0;

            _isPreorder.push(preOrder);
          }
        }
      }

      if (_isPreorder.includes(true)) {
        setIsPreOrder(true);
      } else {
        setIsPreOrder(false);
      }
    } else {
      setIsPreOrder(false);
    }
  }, [checkedItems]);

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
      loading: cartLoading,
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
    checkout: {
      step: checkoutStep,
      items: checkedItems,
      chosenAddress: chosenAddress,
      customer: {
        data: userData ? userData.result : null,
        loading: userLoading,
      },

      chosenCourier: chosenCourier,
      _items: checkoutItems(),
      _totalCost: totalCost(),
      _totalSellerCost: totalSellerCost(),
      _sellers: checkedItemsSellers,

      totalChosenCourier: totalChosenCourier(),
      totalProductSellers: totalCheckedSeller(),

      loading: isOrdering,

      handler: {
        changeStep: onCheckoutStepChanges,
        itemPrice: calculcateCheckoutItemPrice,
        chooseAddress: onAddressChoose,
        shippingCost: calculateShippingCost,
        totalWeight: calculateTotalWeight,

        changeCourier: onCourierChangeHandler,
        resetCheckoutState: resetCheckoutState,
        order: onCheckout,
      },
    },
    state: {
      isPreOrder: isPreOrder,
    },
  };

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
