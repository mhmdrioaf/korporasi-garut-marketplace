import { TCustomerCart, TCustomerCartItem } from "@/lib/globals";
import { CheckedState } from "@radix-ui/react-checkbox";
import { MutableRefObject } from "react";

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
    data: TCustomerCart | undefined;
    error: any;
    loading: boolean;

    itemRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;

    items: { [sellerId: number]: TCustomerCartItem[] } | null;

    itemPrice: (item: TCustomerCartItem) => number;

    handler: {
      getSellerName: (sellerId: number) => string;
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
};
