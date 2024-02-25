import { CheckedState } from "@radix-ui/react-checkbox";
import { MutableRefObject } from "react";

export interface IProductsBySeller {
  [sellerId: number]: {
    [cartItemId: string]: TCustomerCartItem & {
      orderable: boolean;
    };
  };
}

export interface ICourierBySeller {
  [sellerId: number]: {
    [value: number]: TShippingCostServiceCost & { service: string };
  };
}

export interface ITotalCostBySeller {
  [sellerId: number]: {
    sellerName: string | null;
    itemsCost: number;
    shippingCost: number;
  };
}

export interface ISellerItems {
  [sellerId: number]: TCustomerCartItem[];
}

type TCartContext = {
  currentCart: TCustomerCart;
  cartItems: {
    checkbox: MutableRefObject<(HTMLButtonElement | null)[]>;
    checkedItemsPrice: number;
    checkedItemsCount: number;
    isDelete: boolean;
    setIsDelete: (isDelete: boolean) => void;
    isLoading: boolean;

    handler: {
      cardClick: (index: number) => void;
      cardChecked: (
        checked: CheckedState,
        item: TCustomerCartItem,
        sellerId: number
      ) => void;
      quantityChange: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        item: TCustomerCartItem,
        options: "decrease" | "increase"
      ) => void;
      delete: () => Promise<void>;
    };
  };

  cart: {
    data: TCustomerCart;

    itemRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;

    items: { [sellerId: number]: TCustomerCartItem[] } | null;

    itemPrice: (item: TCustomerCartItem) => number;

    handler: {
      getSellerName: (sellerId: number) => string | null;
      getSellerAddress: (sellerId: number) => string | undefined;

      deleteItem: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        deletedItem: TCustomerCartItem
      ) => void;
      itemQuantityChange: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        item: TCustomerCartItem,
        options: "decrease" | "increase"
      ) => Promise<void>;
    };
  };

  checkout: {
    step: number | null;
    loading: boolean;

    customer: {
      data: TUser | null;
      loading: boolean;
    };

    items: IProductsBySeller;
    disabledItems: IProductsBySeller;

    chosenAddress: TAddress | null;
    chosenCourier: ICourierBySeller;

    _items: ISellerItems;
    _totalCost: number;
    _totalSellerCost: ITotalCostBySeller;
    _sellers: string[];

    totalChosenCourier: number;
    totalProductSellers: number;

    handler: {
      changeStep: (value: number | null) => void;
      itemPrice: (item: TCustomerCartItem) => number;
      chooseAddress: (chosenAddress: TAddress) => void;
      totalWeight: (items: TCustomerCartItem[]) => number;
      shippingCost: (
        sellerAddress: TAddress,
        totalWeight: number
      ) => Promise<TShippingCost[] | null>;

      changeCourier: (
        sellerId: number,
        courier: TShippingCostServiceCost & { service: string }
      ) => void;

      resetCheckoutState: () => void;
      order: () => void;
    };
  };

  state: {
    isPreOrder: boolean;
    orderable: boolean;
    sameDay: boolean;
    sameDayData: {
      price: number;
      eta: number;
    };
    sameDayCourier: {
      [sellerID: number]: number;
    };
  };

  handler: {
    sameDayCourier: (sellerID: number, price: number) => void;
  };
};
