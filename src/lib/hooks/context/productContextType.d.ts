import { TProductCategory } from "@/lib/globals";
import { SetStateAction } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";

type TProductInput = {
  title: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  unit: string;
  seller_id: string;
  category_id: string | null;
};

type TVariantItemInput = {
  variant_item_id: string;
  variant_name: string;
  variant_price: number;
  variant_value: string;
};

type TVariantInput = {
  variant_id: string;
  variant_title: string;
  variant_item: TVariantItemInput[];
};

interface IProductInputs {
  product: TProductInput;
  variant: TVariantInput[];
}

type TVariantField = {
  variant_id: string;
  variant_title: string;
  variant_item: TVariantItemInput[];
  id: string;
};

type TProductContextType = {
  productImages: File[];
  productForm: UseFormReturn<IProductInputs, any, undefined>;
  productCategories: TProductCategory[];
  removeVariantItem: (
    index: number,
    deletedItem: TVariantItemInput,
    value: TVariantInput
  ) => void;
  removeVariant: (index: number) => void;
  addVariant: () => void;
  addVariantItem: (index: number, value: TVariantInput) => void;
  variantsField: TVariantField[];
  submitProduct: SubmitHandler<IProductInputs>;
  loadingCategories: boolean;
  addImages: (newImage: File) => void;
  removeImage: (deletedImage: File) => void;
  uploading: boolean;
  product: TProduct | null;
  currentImages: string[];
  removeCurrentImage: (deletedImage: string) => void;
  tags: string[];
  setTags: React.Dispatch<SetStateAction<string[]>>;
};
