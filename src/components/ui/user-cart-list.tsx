"use client";

import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import { Button } from "./button";
import { useCart } from "@/lib/hooks/context/useCart";
import CartItemDeleteModal from "./modals/cart-item-delete";
import { Separator } from "./separator";
import { Checkbox } from "./checkbox";
import Image from "next/image";
import { MinusCircleIcon, PlusCircleIcon, Trash2Icon } from "lucide-react";

export default function UserCartList() {
  const { cart, cartItems } = useCart();

  function showCartItems() {
    const cartData = cart.items ? Object.keys(cart.items) : null;

    if (cartData && cart.items) {
      const items = cart.items;
      return (
        <div className="w-full flex flex-col gap-8 divide-y-4">
          {cartData.length > 0 ? (
            cartData.map((sellerID) => (
              <div
                className="w-full flex flex-col gap-4 p-2 rounded-md divide-y"
                key={sellerID}
              >
                <div className="flex flex-col gap-1">
                  <p className="font-bold">
                    {cart.handler.getSellerName(parseInt(sellerID))}
                  </p>
                  <p className="text-sm">
                    {cart.handler.getSellerAddress(parseInt(sellerID) ?? "")}
                  </p>
                </div>

                {items[parseInt(sellerID)].map((item) => (
                  <div
                    key={item.cart_item_id}
                    className="w-full p-2 grid grid-cols-2"
                  >
                    <div className="w-full flex flex-row items-center gap-2">
                      <Checkbox
                        ref={(el) =>
                          (cart.itemRefs.current[
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
                          {rupiahConverter(cart.itemPrice(item))}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row items-center gap-2 self-center justify-self-end">
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
                ))}
              </div>
            ))
          ) : (
            <div className="w-full text-center">
              Anda belum menambahkan produk ke keranjang.
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="w-full text-center">
          Anda belum menambahkan produk ke keranjang.
        </div>
      );
    }
  }

  return (
    <div className="w-full grid grid-cols-4 relative">
      <div className="w-full flex flex-col gap-4 col-span-3">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-bold text-primary">Keranjang</p>
          <p className="text-sm">
            Berikut adalah daftar produk yang telah anda tambahkan ke keranjang
            belanjaan anda.
          </p>
        </div>

        {cart.loading ? (
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
        ) : !cart.data ? (
          <div className="w-full text-center">
            Anda belum menambahkan produk ke keranjang.
          </div>
        ) : cart.error ? (
          <div className="w-full text-center">
            Gagal mendapatkan data keranjang.
          </div>
        ) : (
          showCartItems()
        )}
      </div>

      <div className="w-[calc(25%-4rem)] p-4 flex flex-col gap-2 rounded-md border border-input fixed justify-self-end">
        <p className="font-bold">Detail Belanja</p>
        <div className="w-full flex flex-row items-center justify-between text-sm">
          <p>Total Harga ({cartItems.checkedItemsCount} produk)</p>
          <p>{rupiahConverter(cartItems.checkedItemsPrice)}</p>
        </div>

        <Separator />

        <div className="w-full flex flex-row items-center justify-between font-bold text-lg">
          <p>Total Harga</p>
          <p>{rupiahConverter(cartItems.checkedItemsPrice)}</p>
        </div>

        <Separator />
        <Button variant="default">
          Checkout ({cartItems.checkedItemsCount})
        </Button>
      </div>

      <CartItemDeleteModal />
    </div>
  );
}
