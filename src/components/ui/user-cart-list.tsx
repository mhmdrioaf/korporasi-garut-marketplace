"use client";

import { useCart } from "@/lib/hooks/context/useCart";
import { Checkbox } from "./checkbox";
import Image from "next/image";
import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import { Button } from "./button";
import { MinusCircleIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";
import CartItemDeleteModal from "./modals/cart-item-delete";
import CartCheckout from "./cart-checkout";
import CartCheckoutAddress from "./cart-checkout-address";
import CartCheckoutProductsDetail from "./cart-checkout-products-detail";

export default function UserCartList() {
  const { cart, cartItems, checkout } = useCart();
  const cartData = cart.items ? Object.keys(cart.items) : null;

  function onCheckoutButtonClicked() {
    checkout.handler.changeStep(1);
  }

  if (cartData && cart.items) {
    const items = cart.items;

    return (
      <div className="w-full relative flex flex-col gap-4 md:gap-8">
        <div className="w-full flex flex-col gap-2 md:gap-4 divide-y">
          {cartData.length > 0 ? (
            cartData.map((sellerID) => (
              <div
                className="w-full flex flex-col gap-2 px-0 py-0 md:px-4 md:py-2"
                key={sellerID}
              >
                <div className="w-full flex flex-col gap-0">
                  <p className="text-sm lg:text-base font-bold">
                    {cart.handler.getSellerName(parseInt(sellerID))}
                  </p>
                  <p className="text-xs">
                    {cart.handler.getSellerAddress(parseInt(sellerID))}
                  </p>
                </div>

                {/* seller items */}
                {items[parseInt(sellerID)]
                  .filter((item) =>
                    item.variant
                      ? item.variant.variant_stock > 0
                      : item.product.stock > 0
                  )
                  .map((item) => (
                    <div
                      className="w-full px-4 py-2 grid grid-cols-1 md:grid-cols-2 rounded-sm border border-input gap-4 md:gap-0"
                      key={item.cart_item_id}
                    >
                      <div className="flex flex-row items-center gap-2">
                        <Checkbox
                          ref={(el) =>
                            (cartItems.checkbox.current[
                              Number(
                                item.cart_item_id.slice(
                                  item.cart_item_id.length - 5,
                                  item.cart_item_id.length
                                )
                              )
                            ] = el)
                          }
                          onCheckedChange={(checked) =>
                            cartItems.handler.cardChecked(
                              checked,
                              item,
                              parseInt(sellerID)
                            )
                          }
                        />

                        <div className="w-16 h-16 rounded-sm overflow-hidden relative shrink-0">
                          <Image
                            src={remoteImageSource(item.product.images[0])}
                            sizes="100vw"
                            alt="foto produk"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex flex-col gap-1 text-xs lg:text-sm">
                          <p>
                            {item.product.title}{" "}
                            {item.variant
                              ? `- ${item.variant.variant_name}`
                              : ""}
                          </p>
                          <p className="font-bold">
                            {rupiahConverter(cart.itemPrice(item))}
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:w-fit flex flex-row-reverse md:flex-row items-center justify-between md:justify-normal gap-2 self-center justify-self-center md:justify-self-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(event) =>
                            cart.handler.deleteItem(event, item)
                          }
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </Button>

                        <div className="min-h-full w-px bg-input" />

                        <div className="flex flex-row items-center gap-4">
                          <Button
                            variant="destructive"
                            disabled={item.quantity <= 1}
                            onClick={(event) =>
                              cart.handler.itemQuantityChange(
                                event,
                                item,
                                "decrease"
                              )
                            }
                            size="icon"
                          >
                            <MinusCircleIcon className="w-4 h-4" />
                          </Button>
                          <p className="text-sm">{item.quantity}</p>
                          <Button
                            variant="default"
                            onClick={(event) =>
                              cart.handler.itemQuantityChange(
                                event,
                                item,
                                "increase"
                              )
                            }
                            size="icon"
                          >
                            <PlusCircleIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))
          ) : (
            <div className="text-xs w-full">
              Anda belum menambahkan produk ke keranjang.
            </div>
          )}
        </div>

        {cartData.length > 0 && (
          <div className="w-full flex flex-col gap-2 md:gap-4 divide-y mb-32 md:mb-0">
            <div className="w-full flex flex-col gap-1 lg:gap-2">
              <p className="font-bold text-base lg:text-2xl text-primary">
                Produk yang tidak tersedia
              </p>
              <p className="text-xs lg:text-sm">
                Produk-produk berikut saat ini tidak tersedia, jika anda ingin
                memesan produk-produk ini, silahkan lakukan pemesanan pre-order
                di halaman produk.
              </p>
            </div>

            {cartData.map((sellerID) => (
              <div
                className="w-full flex flex-col gap-2 px-0 py-0 md:px-4 md:py-2"
                key={sellerID}
              >
                {items[parseInt(sellerID)]
                  .filter((item) =>
                    item.variant
                      ? item.variant.variant_stock <= 0
                      : item.product.stock <= 0
                  )
                  .map((item) => (
                    <>
                      <div
                        key={item.cart_item_id}
                        className="w-full px-4 py-2 grid grid-cols-1 md:grid-cols-2 rounded-sm border border-input gap-4 md:gap-0 opacity-70"
                      >
                        <div className="flex flex-row items-center gap-2">
                          <div className="w-16 h-16 rounded-sm overflow-hidden relative shrink-0">
                            <Image
                              src={remoteImageSource(item.product.images[0])}
                              sizes="100vw"
                              alt="foto produk"
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex flex-col gap-1 text-xs lg:text-sm">
                            <p>
                              {item.product.title}{" "}
                              {item.variant
                                ? `- ${item.variant.variant_name}`
                                : ""}
                            </p>
                            <p className="font-bold">
                              {rupiahConverter(cart.itemPrice(item))}
                            </p>
                          </div>
                        </div>

                        <div className="w-full md:w-fit self-center justify-self-center md:justify-self-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(event) =>
                              cart.handler.deleteItem(event, item)
                            }
                            className="w-full md:w-fit bg-destructive md:bg-white text-destructive-foreground md:text-black"
                          >
                            <Trash2Icon className="w-4 h-4 hidden md:block" />
                            <span className="block md:hidden">
                              Hapus Produk
                            </span>
                          </Button>
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            ))}
          </div>
        )}

        <div className="w-[calc(100%-2.5rem)] md:w-[calc(100%-8rem)] fixed bottom-4 rounded-md border border-input bg-white z-30 px-4 py-2 flex flex-col md:flex-row items-start md:items-center gap-2 lg:gap-4 justify-normal md:justify-between">
          <div className="flex flex-col gap-1 lg:gap-2">
            <p className="text-xs">Total Harga</p>
            <p className="text-lg font-bold">
              {rupiahConverter(cartItems.checkedItemsPrice)}
            </p>
          </div>
          <Button
            variant="default"
            disabled={cartItems.checkedItemsCount < 1}
            onClick={onCheckoutButtonClicked}
            className="w-full md:w-fit"
          >
            Checkout ({cartItems.checkedItemsCount})
          </Button>
        </div>

        <CartItemDeleteModal />

        <CartCheckout open={checkout.step !== null}>
          <CartCheckoutAddress />
          <CartCheckoutProductsDetail />
        </CartCheckout>
      </div>
    );
  }
}
