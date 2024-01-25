"use client";

import {
  ChangeEvent,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { TDirectPurchaseContext } from "./directPurchaseContextType";
import {
  TAddress,
  TProduct,
  TProductVariantItem,
  TShippingCost,
  TShippingCostServiceCost,
} from "@/lib/globals";
import { useToast } from "@/components/ui/use-toast";
import useSWR, { useSWRConfig } from "swr";
import { calculateSameDayCost, fetcher, invoiceMaker } from "@/lib/helper";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

interface IDirectPurchaseContextProps {
  product: TProduct;
  user_id: string | null;
  children: ReactNode;
}

export const DirectPurchaseContext =
  createContext<TDirectPurchaseContext | null>(null);

export function useDirectPurchase() {
  return useContext(DirectPurchaseContext) as TDirectPurchaseContext;
}

export function DirectPurchaseProvider({
  product,
  user_id,
  children,
}: IDirectPurchaseContextProps) {
  const [withVariants, setWithVariants] = useState<boolean>(false);
  const [variantsValue, setVariantsValue] =
    useState<TProductVariantItem | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(product.price);
  const [productQuantity, setProductQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [chosenCourier, setChosenCourier] =
    useState<TShippingCostServiceCost | null>(null);
  const [chosenAddress, setChosenAddress] = useState<TAddress | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderStep, setOrderStep] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [cartLoading, setCartLoading] = useState(false);
  const [sameDayModalOpen, setSameDayModalOpen] = useState(false);
  const [isSameDay, setIsSameDay] = useState<boolean>(false);
  const [orderable, setOrderable] = useState<boolean>(true);
  const [sameDayCost, setSameDayCost] = useState<number>(0);

  const [isWarning, setIsWarning] = useState(false);
  const [isVariantChooserOpen, setIsVariantChooserOpen] = useState(false);
  const [variantChooserContext, setVariantChooserContext] = useState<
    "cart" | "buy" | null
  >(null);

  const [isPreorder, setIsPreorder] = useState<boolean>(false);

  const defaultPrice = variantsValue
    ? variantsValue.variant_price * productQuantity
    : product.price * productQuantity;

  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = useSWR(
    user_id ? "/api/get-detail/" + user_id : null,
    fetcher
  );
  const {
    data: shippingCosts,
    isLoading: shippingCostLoading,
    isValidating: shippingCostValidating,
    mutate: shippingCostMutate,
  } = useSWR(chosenAddress ? "/api/shipping/cost" : null, (url) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        origin: sellerAddress?.city.city_id,
        destination: chosenAddress?.city.city_id,
        weight: product.weight,
      }),
    })
      .then((res) => res.json())
      .then((res) => res.result as TShippingCost[])
  );

  const { mutate } = useSWRConfig();

  const sellerAddress = product.seller.address.find(
    (address) => address.address_id === product.seller.primary_address_id
  );

  const router = useRouter();

  const onQuantityChangeHandler = (option: "increase" | "decrease") => {
    if (option === "increase") {
      setProductQuantity((prev) => (prev === product.stock ? prev : prev + 1));
      setTotalPrice((prev) =>
        variantsValue
          ? variantsValue.variant_price + prev
          : prev + product.price
      );
    } else {
      setProductQuantity((prev) => (prev === 1 ? 1 : prev - 1));
      setTotalPrice((prev) =>
        variantsValue
          ? prev - variantsValue.variant_price
          : prev - product.price
      );
    }
  };

  const onQuantityInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);

    if (!isNaN(value)) {
      if (!variantsValue) {
        if (value > product.stock) {
          setProductQuantity(product.stock);
          setTotalPrice(product.price * product.stock);
        } else if (value < 1) {
          setProductQuantity(1);
          setTotalPrice(product.price);
        } else {
          setProductQuantity(value);
          setTotalPrice(product.price * value);
        }
      } else {
        if (value > variantsValue.variant_stock) {
          setProductQuantity(variantsValue.variant_stock);
          setTotalPrice(
            variantsValue.variant_price * variantsValue.variant_stock
          );
        } else if (value < 1) {
          setProductQuantity(1);
          setTotalPrice(variantsValue.variant_price);
        } else {
          setProductQuantity(value);
          setTotalPrice(variantsValue.variant_price * value);
        }
      }
    } else {
      setProductQuantity(1);
      setTotalPrice(
        variantsValue
          ? variantsValue.variant_price + product.price
          : product.price
      );
    }
  };

  const showVariantChooser = (ctx: "cart" | "buy") => {
    if (product.variant && !variantsValue) {
      setIsVariantChooserOpen(true);
      setVariantChooserContext(ctx);
    }
  };

  const closeVariantChooser = () => {
    setIsVariantChooserOpen(false);
    setVariantChooserContext(null);
  };

  const onAddToCart = async () => {
    setCartLoading(true);
    try {
      if (!user_id) {
        router.push(ROUTES.AUTH.LOGIN);
      } else {
        const res = await fetch(process.env.NEXT_PUBLIC_API_CART_ADD_ITEM!, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user_id,
            product: product,
            product_variant: variantsValue,
            product_quantity: productQuantity,
          }),
        });

        const response = await res.json();
        if (!response.ok) {
          setCartLoading(false);
          toast({
            variant: "destructive",
            title: "Gagal menambahkan produk ke keranjang",
            description: response.message,
          });
        } else {
          setCartLoading(false);
          toast({
            variant: "success",
            title: "Berhasil menambahkan produk ke keranjang",
            description: response.message,
          });
          mutate("/api/cart-list");
          setIsVariantChooserOpen(false);
        }
      }
    } catch (error) {
      setCartLoading(false);
      console.error(
        "An error occurred while adding product to the cart: ",
        error
      );
      toast({
        variant: "destructive",
        title: "Gagal menambahkan produk ke keranjang",
        description:
          "Telah terjadi kesalahan pada server. Silahkan coba lagi nanti; hubungi developer jika masalah terus berlanjut.",
      });
    }
  };

  const onVariantsChangeHandler = useCallback(
    (item: TProductVariantItem) => {
      setTotalPrice(product.price * productQuantity);
      if (
        variantsValue &&
        variantsValue.variant_item_id === item.variant_item_id
      ) {
        setWithVariants(false);
        setVariantsValue(null);
        setTotalPrice(product.price * productQuantity);
      } else {
        setWithVariants(true);
        setVariantsValue(item);
        setTotalPrice(item.variant_price * productQuantity);
      }
    },
    [product.price, productQuantity, variantsValue]
  );

  const onCourierChangeHandler = (courier: TShippingCostServiceCost) => {
    setChosenCourier(courier);
    setTotalPrice(defaultPrice + courier.value);
    setShippingCost(courier.value);
  };

  const onAddressChoose = (chosenAddress: TAddress) => {
    setChosenAddress(chosenAddress);
    setOrderStep(2);
    shippingCostMutate();
  };

  const onOrder = () => {
    if (user) {
      setOrderStep(1);
    } else {
      router.push(ROUTES.AUTH.LOGIN);
    }
  };

  const isModalOpen = (currentStep: number) => {
    return orderStep === currentStep;
  };

  const onPlaceOrder = async () => {
    setOrderLoading(true);
    if (!user_id) {
      setOrderLoading(false);
      toast({
        variant: "destructive",
        title: "User ID tidak ditemukan!",
      });
    } else {
      if (!chosenAddress) {
        setOrderLoading(false);
        toast({
          variant: "destructive",
          title: "Anda belum memilih alamat pengiriman.",
        });
      } else {
        const makeOrder = await invoiceMaker(
          user_id,
          product,
          productQuantity,
          chosenAddress,
          shippingCost,
          variantsValue,
          totalPrice,
          isPreorder
        );
        if (!makeOrder.ok) {
          setOrderLoading(false);
          toast({
            variant: "destructive",
            title: "Terjadi kesalahan ketika melakukan pemesanan",
            description: makeOrder.message,
          });
        } else {
          setOrderLoading(false);
          setOrderStep(3);
        }
      }
    }
  };

  const resetPrice = () => {
    setTotalPrice(defaultPrice);
  };

  const onResetAll = () => {
    resetPrice();
    setOrderStep(null);
    setChosenCourier(null);
    setChosenAddress(null);
  };

  const onSamedayModalClose = () => {
    setSameDayModalOpen(false);
  };

  useEffect(() => {
    const unsub = () => {
      if (product.variant && !variantsValue) {
        setIsWarning(true);
      }
    };

    return () => unsub();
  }, [product.price, onVariantsChangeHandler, product.variant, variantsValue]);

  useEffect(() => {
    if (product.variant && !variantsValue) {
      setIsWarning(true);
    } else {
      setIsWarning(false);
    }
  }, [product.variant, variantsValue]);

  useEffect(() => {
    if (variantsValue) {
      const status = variantsValue.variant_stock < 1;
      setIsPreorder(status);
    } else {
      const status = product.stock < 1;
      setIsPreorder(status);
    }
  }, [variantsValue, productQuantity, product]);

  useEffect(() => {
    if (!product.capable_out_of_town) {
      setIsSameDay(true);
      setSameDayModalOpen(true);
    }
  }, [product.capable_out_of_town]);

  useEffect(() => {
    if (chosenAddress && sellerAddress) {
      if (isSameDay) {
        if (chosenAddress.city.city_id !== sellerAddress.city.city_id) {
          setOrderable(false);
        } else {
          setOrderable(true);
        }
      } else {
        setOrderable(true);
      }
    }
  }, [chosenAddress, sellerAddress, isSameDay]);

  useEffect(() => {
    if (isSameDay) {
      if (chosenAddress && sellerAddress) {
        if (chosenAddress.city.city_id === sellerAddress.city.city_id) {
          const fetchShippingData = async () => {
            const res = await fetch(
              process.env.NEXT_PUBLIC_API_SAMEDAY_SHIPPING_COST!,
              {
                method: "POST",
                body: JSON.stringify({
                  currentLocation: {
                    lat: chosenAddress.latitude,
                    long: chosenAddress.longitude,
                  },
                  origin: {
                    lat: sellerAddress.latitude,
                    long: sellerAddress.longitude,
                  },
                }),
              }
            );

            const response = await res.json();

            console.log(response);

            console.log(response.result);

            if (response.ok) {
              setSameDayCost(calculateSameDayCost(response.result));
            }
          };

          fetchShippingData();
        }
      }
    }
  }, [chosenAddress, sellerAddress, isSameDay]);

  const value: TDirectPurchaseContext = {
    quantity: {
      productQuantity: productQuantity,
      setProductQuantity: setProductQuantity,

      handler: {
        onQuantityChange: onQuantityChangeHandler,
        onQuantityInputChange: onQuantityInputChangeHandler,
      },
    },
    image: {
      activeImage: activeImageIndex,
      setActiveImage: setActiveImageIndex,
    },
    price: {
      totalPrice: totalPrice,
      setTotalPrice: setTotalPrice,
    },
    product: product,
    shipping: {
      chosenCourier: chosenCourier,
      setChosenCourier: setChosenCourier,
      sellerAddress: sellerAddress!,
      cost: {
        loading: shippingCostLoading,
        validating: shippingCostValidating,
        data: shippingCosts,
      },
      sameDayCost: sameDayCost,

      handler: {
        onCourierChange: onCourierChangeHandler,
      },
    },
    user_id: user_id,
    variants: {
      setVariantValue: setVariantsValue,
      variantValue: variantsValue,
      withVariants: withVariants,
      setWithVariants: setWithVariants,

      handler: {
        onVariantsChange: onVariantsChangeHandler,
        showVariantChooser: showVariantChooser,
        closeVariantChooser: closeVariantChooser,
      },
    },
    handler: {
      resetPrice: resetPrice,
      resetAll: onResetAll,
      onSamedayModalClose: onSamedayModalClose,
    },
    customer: {
      user: user ? user.result : null,
      loading: userLoading,

      address: {
        chosenAddress: chosenAddress,
        setChosenAddress: setChosenAddress,
        handler: {
          onAddressChange: onAddressChoose,
        },
      },
    },
    order: {
      step: orderStep,
      setStep: setOrderStep,
      loading: orderLoading,
      handler: {
        isModalOpen: isModalOpen,
        onOrder: onOrder,
        placeOrder: onPlaceOrder,
      },
    },
    cart: {
      loading: cartLoading,

      handler: {
        onAddToCart: onAddToCart,
      },
    },
    state: {
      isWarning: isWarning,
      isVariantChooserOpen: isVariantChooserOpen,
      setVariantChooserOpen: setIsVariantChooserOpen,
      variantChooserContext: variantChooserContext,
      isPreorder: isPreorder,
      isSameDay: isSameDay,
      sameDayModalOpen: sameDayModalOpen,
      orderable: orderable,
    },
  };

  return (
    <DirectPurchaseContext.Provider value={value}>
      {children}
    </DirectPurchaseContext.Provider>
  );
}
