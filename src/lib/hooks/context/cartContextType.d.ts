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

  render: {
    items: () => JSX.Element;
  };
};
