import {
  TAddress,
  TProduct,
  TProductVariantItem,
  TShippingCost,
  TShippingCostServiceCost,
  TUser,
} from "@/lib/globals";

type TDirectPurchaseContext = {
  variants: {
    withVariants: boolean;
    setWithVariants: (withVariants: boolean) => void;
    variantValue: TProductVariantItem | null;
    setVariantValue: (variantValue: TProductVariantItem | null) => void;

    handler: {
      onVariantsChange: (variant: TProductVariantItem) => void;
      showVariantChooser: (ctx: "cart" | "buy") => void;
      closeVariantChooser: () => void;
    };
  };
  quantity: {
    productQuantity: number;
    setProductQuantity: (quantity: number) => void;

    handler: {
      onQuantityChange: (option: "increase" | "decrease") => void;
      onQuantityInputChange: (
        event: React.ChangeEvent<HTMLInputElement>
      ) => void;
    };
  };
  price: {
    totalPrice: number;
    setTotalPrice: (price: number) => void;
  };
  image: {
    activeImage: number;
    setActiveImage: (index: number) => void;
  };
  shipping: {
    chosenCourier: TShippingCostServiceCost | null;
    setChosenCourier: (courier: TShippingCostServiceCost | null) => void;
    sellerAddress: TAddress;
    cost: {
      loading: boolean;
      validating: boolean;
      data?: TShippingCost[];
    };

    handler: {
      onCourierChange: (courier: TShippingCostServiceCost) => void;
    };
  };
  product: TProduct;
  user_id: string | null;
  customer: {
    user: TUser | null;
    loading: boolean;

    address: {
      chosenAddress: TAddress | null;
      setChosenAddress: (address: TAddress | null) => void;

      handler: {
        onAddressChange: (address: TAddress) => void;
      };
    };
  };
  handler: {
    resetPrice: () => void;
    resetAll: () => void;
  };
  order: {
    step: number | null;
    setStep: (step: number | null) => void;
    loading: boolean;

    handler: {
      onOrder: () => void;
      isModalOpen: (currentStep: number) => boolean;
      placeOrder: () => void;
    };
  };
  cart: {
    loading: boolean;

    handler: {
      onAddToCart: () => Promise<void>;
    };
  };

  state: {
    isWarning: boolean;
    isVariantChooserOpen: boolean;
    setVariantChooserOpen: (isVariantChooser: boolean) => void;
    variantChooserContext: "cart" | "buy" | null;
    isPreorder: boolean;
  };
};
