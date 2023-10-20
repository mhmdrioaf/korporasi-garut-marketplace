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
    const totalPrice = productPrice + variantPrice;

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
          totalPrice += (variant.variant_price + product.price) * quantity;
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

  function renderProductItemsBySeller() {
    if (cartLoading) {
      return (
        <div className="w-full flex flex-col gap-8">
          <div className="w-full flex flex-col gap-4 p-2">
            <div className="flex flex-col gap-1">
              <div className="w-[8ch] h-8 rounded-sm bg-stone-300 animate-pulse" />
              <div className="w-[16ch] h-4 rounded-sm bg-stone-300 animate-pulse" />
            </div>
          </div>

          {[...Array(4)].map((_, idx) => (
            <div className="w-full grid grid-cols-2 p-2" key={idx}>
              <div className="w-full flex flex-row items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-stone-300 animate-pulse" />
                <div className="w-16 h-16 rounded-sm bg-stone-300 animate-pulse" />
                <div className="flex flex-col gap-1">
                  <div className="w-[12ch] h-3 rounded-sm bg-stone-300 animate-pulse" />
                  <div className="w-[9ch] h-2 rounded-sm bg-stone-300 animate-pulse" />
                </div>
              </div>

              <div className="flex flex-row items-center gap-2 self-center justify-self-end">
                <div className="w-8 h-8 rounded-sm bg-stone-300 animate-pulse" />
                <div className="w-px min-h-full rounded-sm bg-stone-300" />
                <div className="w-8 h-8 rounded-sm bg-stone-300 animate-pulse" />
                <div className="w-8 h-8 rounded-sm bg-stone-300 animate-pulse" />
                <div className="w-8 h-8 rounded-sm bg-stone-300 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      );
    } else if (!cartData) {
      return (
        <div className="w-full text-center">
          Anda belum menambahkan produk ke keranjang.
        </div>
      );
    } else if (cartError) {
      return (
        <div className="w-full text-center">
          Gagal mendapatkan data keranjang.
        </div>
      );
    } else {
      const groupedCartItems = groupCartItemsBySeller();
      const cart = groupedCartItems ? Object.keys(groupedCartItems) : null;

      // return groupedCartItems ? (
      //   <div className="w-full flex flex-col gap-8 mb-24">
      //     {Object.keys(groupedCartItems).map((sellerId) => (
      //       <div
      //         className="w-full flex flex-col gap-4 rounded-md border border-input px-4 py-2"
      //         key={sellerId}
      //       >
      //         <p className="font-bold text-xl">
      //           {getSellerName(parseInt(sellerId))}
      //         </p>
      //         <Separator />
      //         {groupedCartItems[parseInt(sellerId)].map((item) => (
      //           <div
      //             className="w-full rounded-md grid grid-cols-5 p-2 border border-input cursor-pointer relative"
      //             key={item.cart_item_id}
      //           >
      //             <div
      //               className="absolute top-0 left-0 w-full h-full z-10"
      //               onClick={() =>
      //                 onItemCardClick(
      //                   Number(
      //                     item.cart_item_id.slice(
      //                       item.cart_item_id.length - 5,
      //                       item.cart_item_id.length
      //                     )
      //                   )
      //                 )
      //               }
      //             />
      //             <div className="col-span-1 w-full flex flex-row items-center gap-2">
      //               <Checkbox
      //                 ref={(el) =>
      //                   (itemRef.current[
      //                     Number(
      //                       item.cart_item_id.slice(
      //                         item.cart_item_id.length - 5,
      //                         item.cart_item_id.length
      //                       )
      //                     )
      //                   ] = el)
      //                 }
      //                 onCheckedChange={(checked) =>
      //                   onItemChecked(checked, item, parseInt(sellerId))
      //                 }
      //               />
      //               <div className="relative w-48 h-auto aspect-square rounded-sm overflow-hidden">
      //                 <Image
      //                   src={remoteImageSource(item.product.images[0])}
      //                   fill
      //                   className="object-cover"
      //                   alt="Foto produk"
      //                   sizes="100vw"
      //                 />
      //               </div>
      //             </div>

      //             <div className="flex flex-col gap-2 place-self-center">
      //               <p className="text-xl font-semibold">
      //                 {item.product.title}
      //               </p>
      //               <p className="text-sm">
      //                 {item.product.seller.account.user_name} -{" "}
      //                 {sellerAddress(item.product.seller) ?? ""}
      //               </p>
      //             </div>

      //             <div className="grid grid-cols-2 gap-2 place-self-center text-sm col-span-2">
      //               <p className="font-bold">Harga Produk</p>
      //               <p>{rupiahConverter(item.product.price)}</p>
      //               <p className="font-bold">Total Produk</p>
      //               <p>
      //                 {item.quantity} {item.product.unit} ={" "}
      //                 {rupiahConverter(item.quantity * item.product.price)}
      //               </p>
      //               {item.variant && (
      //                 <>
      //                   <p className="font-bold">Varian Produk</p>
      //                   <p>{item.variant.variant_name}</p>
      //                   <p className="font-bold">Harga Varian</p>
      //                   <p>
      //                     {rupiahConverter(item.variant.variant_price)}/
      //                     {item.product.unit} ={" "}
      //                     {rupiahConverter(
      //                       item.variant.variant_price * item.quantity
      //                     )}
      //                   </p>
      //                 </>
      //               )}
      //               <p className="font-bold text-lg">Total Harga</p>
      //               <p className="font-bold text-lg">
      //                 {rupiahConverter(calculateTotalPrice(item))}
      //               </p>
      //             </div>

      //             <div className="flex flex-col gap-2 place-self-center col-span-1 z-20">
      //               <div className="flex flex-row items-center gap-2 justify-between">
      //                 <Button
      //                   variant="destructive"
      //                   size="sm"
      //                   onClick={(event) =>
      //                     onQuantityChange(event, item, "decrease")
      //                   }
      //                 >
      //                   <MinusIcon className="w-4 h-4" />
      //                 </Button>
      //                 <p className="font-bold text-center">{item.quantity}</p>
      //                 <Button
      //                   variant="default"
      //                   size="sm"
      //                   onClick={(event) =>
      //                     onQuantityChange(event, item, "increase")
      //                   }
      //                 >
      //                   <PlusIcon className="w-4 h-4" />
      //                 </Button>
      //               </div>

      //               <Button variant="default" asChild>
      //                 <Link
      //                   href={ROUTES.PRODUCT.DETAIL(item.product_id.toString())}
      //                 >
      //                   Lihat Produk
      //                 </Link>
      //               </Button>
      //               <Button
      //                 className="w-full"
      //                 variant="destructive"
      //                 onClick={(event) => onDeleteButtonClicked(event, item)}
      //               >
      //                 Hapus dari Keranjang
      //               </Button>
      //             </div>
      //           </div>
      //         ))}
      //       </div>
      //     ))}
      //   </div>
      // ) : (
      //   <div className="w-full text-center">
      //     Anda belum menambahkan produk ke keranjang.
      //   </div>
      // );

      return groupedCartItems && cart ? (
        <div className="w-full flex flex-col gap-8 divide-y-4">
          {cart.map((sellerID) => (
            <div
              className="w-full flex flex-col gap-4 p-2 rounded-md divide-y"
              key={sellerID}
            >
              <div className="flex flex-col gap-1">
                <p className="font-bold">{getSellerName(parseInt(sellerID))}</p>
                <p className="text-sm">
                  {sellerAddress(parseInt(sellerID) ?? "")}
                </p>
              </div>

              {groupedCartItems[parseInt(sellerID)].map((item) => (
                <div
                  key={item.cart_item_id}
                  className="w-full p-2 grid grid-cols-2"
                >
                  <div className="w-full flex flex-row items-center gap-2">
                    <Checkbox
                      ref={(el) =>
                        (itemRef.current[
                          Number(
                            item.cart_item_id.slice(
                              item.cart_item_id.length - 5,
                              item.cart_item_id.length
                            )
                          )
                        ] = el)
                      }
                      onCheckedChange={(checked) =>
                        onItemChecked(checked, item, parseInt(sellerID))
                      }
                    />
                    <div className="w-16 h-16 rounded-sm overflow-hidden relative">
                      <Image
                        src={remoteImageSource(item.product.images[0])}
                        sizes="100vw"
                        alt="foto produk"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <p>
                        {item.product.title}{" "}
                        {item.variant ? `- ${item.variant.variant_name}` : ""}
                      </p>
                      <p className="font-bold">
                        {rupiahConverter(calculateTotalPrice(item))}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row items-center gap-2 self-center justify-self-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => onDeleteButtonClicked(event, item)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>

                    <div className="min-h-full w-px bg-input" />

                    <Button
                      variant="destructive"
                      disabled={item.quantity <= 1}
                      onClick={(event) =>
                        onQuantityChange(event, item, "decrease")
                      }
                      size="icon"
                    >
                      <MinusCircleIcon className="w-4 h-4" />
                    </Button>
                    <p className="text-sm">{item.quantity}</p>
                    <Button
                      variant="default"
                      onClick={(event) =>
                        onQuantityChange(event, item, "increase")
                      }
                      size="icon"
                    >
                      <PlusCircleIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full text-center">
          Anda belum menambahkan produk ke keranjang.
        </div>
      );
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
    render: {
      items: renderProductItemsBySeller,
    },
    currentCart: cartData!,
  };

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
}
