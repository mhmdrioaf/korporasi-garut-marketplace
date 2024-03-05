import { SubmitHandler, UseFormReturn } from "react-hook-form";

type TProductContext = {
  form: {
    productForm: UseFormReturn<IProductInput, any, undefined>;
    variant: {
      items: TVariantItemsInput[];
      withVariants: boolean;
      handler: {
        add: (value: "true" | "false") => void;
        remove: () => void;
        removeCurrent: (id: string) => void;
        addItem: () => void;
        removeItem: (index: number) => void;
      };
    };
    handler: {
      submitProduct: SubmitHandler<IProductInput>;
      updateProduct: SubmitHandler<IProductInput>;
    };
  };

  currentProduct: TProduct | null;

  images: {
    images: File[];
    current: string[];

    handler: {
      add: (image: File) => void;
      remove: (deletedImage: File) => void;
      currentImageRemove: (deletedImage: string) => void;
    };
  };

  tags: {
    current: string[];

    handler: {
      add: React.Dispatch<React.SetStateAction<string[]>>;
    };
  };

  state: {
    uploading: boolean;
    isEdit: boolean;
  };
};

type TVariantItemsInput = {
  variant_item_id: string;
  variant_item_name: string;
  variant_item_stock: number;
  variant_item_price: number;
  id: string;
};

type TProductInput = {
  title: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  images: string[];
  unit: string;
  seller_id: string;
  category_id: string | null;
  expire_date: string;
  storage_period: number;
  capable_out_of_town: boolean;
};

type TProductVariantInput = {
  variant_id: string;
  variant_title: string;
  variant_item: TProductVariantItemInput[];
};

type TProductVariantItemInput = {
  variant_item_id: string;
  variant_item_name: string;
  variant_item_price: number;
  variant_item_stock: number;
};

export interface IProductInput {
  product: TProductInput;
  variant: TProductVariantInput | null;
}
