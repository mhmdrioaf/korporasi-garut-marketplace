"use client";

import { TProductCategory } from "@/lib/globals";
import { NaNHandler, fetcher, uploadProductImage } from "@/lib/helper";
import { ReactNode, createContext, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import useSWR from "swr";
import { TProductContextType } from "./productContextType";
import { useToast } from "@/components/ui/use-toast";
import imageCompression from "browser-image-compression";
import { Session } from "next-auth";

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
  id: string;
  variant_name: string;
  variant_price: number;
  variant_value: string;
};

type TVariantInput = {
  variant_title: string;
  variant_item: TVariantItemInput[];
};

interface IProductInputs {
  product: TProductInput;
  variant: TVariantInput[];
}

export const ProductContext = createContext<TProductContextType | null>(null);

export function ProductProvider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session;
}) {
  const [productImages, setProductImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<IProductInputs>({
    mode: "onChange",
  });

  const { data: productCategories, isLoading: categoriesLoading } = useSWR(
    "/api/category/list",
    fetcher
  );

  const { data: productsList } = useSWR("/api/product/list", fetcher);

  const variants = useFieldArray({
    name: "variant",
    control: form.control,
  });

  const watchVariants = form.watch("variant");
  const controlledVariants =
    variants.fields.length > 0
      ? variants.fields.map((field, index) => {
          return {
            ...field,
            ...watchVariants[index],
          };
        })
      : [];

  const onAddVariantHandler = () => {
    variants.append({
      variant_title: "",
      variant_item: [],
    });
  };

  const onAddVariantItemHandler = (index: number, value: TVariantInput) => {
    const currentVariantItem = value.variant_item;
    const variantItemIds = currentVariantItem.map((item) =>
      NaNHandler(parseInt(item.id.slice(item.id.length - 1, item.id.length)))
    );

    const maxId = Math.max(...variantItemIds);

    variants.update(index, {
      ...value,
      variant_item: [
        ...value.variant_item,
        {
          id: `item-${index + 1}-${isNaN(maxId) ? 1 : maxId + 1}`,
          variant_name: "",
          variant_price: 0,
          variant_value: "",
        },
      ],
    });
  };

  const onDeleteVariantItemHandler = (
    index: number,
    deletedItem: TVariantItemInput,
    value: TVariantInput
  ) => {
    const newVariantItem = value.variant_item.filter(
      (item) => item !== deletedItem
    );
    variants.update(index, {
      ...value,
      variant_item: newVariantItem,
    });
  };

  const onDeleteVariantHandler = (index: number) => {
    variants.remove(index);
  };

  const onProductImageAddHandler = (newImage: File) => {
    setProductImages((prev) => [...prev, newImage]);
  };

  const onProductImageDeleteHandler = (deletedImage: File) => {
    const updatedProductImages = productImages.filter(
      (image) => image !== deletedImage
    );
    setProductImages(updatedProductImages);
  };

  const uploadImages = async (productId: number) => {
    let imagesURL = [];
    for (let index = 0; index < productImages.length; index++) {
      const compressedImage = await imageCompression(productImages[index], {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
      });

      const uploadImage = await uploadProductImage(
        compressedImage,
        `/PROD-${productId}/${index + 1}.jpg`
      );
      if (uploadImage.imageURL) {
        imagesURL.push(uploadImage.imageURL);
      }
    }
    return imagesURL;
  };

  const resetForm = () => {
    setProductImages([]);
    variants.remove();
    form.reset();
  };

  const onSubmit: SubmitHandler<IProductInputs> = async (data) => {
    setUploading(true);
    const { variant, ...rest } = data;
    const variantsData = variant.map(({ variant_item, ...rest }) => rest);
    const variantItemsData = variant.flatMap((variant) =>
      variant.variant_item.map(({ id, ...items }) => items)
    );
    const productsId = productsList ? productsList.result.maxId + 1 : 1;
    const imagesURL = await uploadImages(productsId);

    const product = {
      ...rest.product,
      images: imagesURL,
      variant: variantsData.length > 0 ? variantsData : null,
      variant_items: variantItemsData.length > 0 ? variantItemsData : null,
      category_id: rest.product.category_id ?? null,
      seller_id: session.user.id,
    };

    try {
      const uploadProduct = await fetch(
        process.env.NEXT_PUBLIC_API_PRODUCT_CREATE!,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Seller_Key: process.env.NEXT_PUBLIC_SELLER_SCRET!,
          },
          body: JSON.stringify({
            ...product,
            secret: session.user.token,
          }),
        }
      );

      const uploadResponse = await uploadProduct.json();
      if (!uploadResponse.ok) {
        setUploading(false);
        toast({
          variant: "destructive",
          title: "Telah terjadi kesalahan ketika menambahkan produk baru.",
          description: uploadResponse.message,
        });
      } else {
        setUploading(false);
        toast({
          variant: "success",
          title: "Berhasil menambahkan produk baru.",
          description: uploadResponse.message,
        });
        resetForm();
      }
    } catch (err) {
      setUploading(false);
      toast({
        variant: "destructive",
        title: "Telah terjadi kesalahan ketika menambahkan produk baru.",
        description:
          "Silahkan coba lagi nanti, atau hubungi developer jika masalah terus berlanjut.",
      });
    }
  };

  const value = {
    removeVariantItem: onDeleteVariantItemHandler,
    removeVariant: onDeleteVariantHandler,
    addVariant: onAddVariantHandler,
    addVariantItem: onAddVariantItemHandler,
    variantsField: controlledVariants,
    productForm: form,
    submitProduct: onSubmit,
    productCategories: productCategories
      ? (productCategories.result as TProductCategory[])
      : ([] as TProductCategory[]),
    loadingCategories: categoriesLoading,
    addImages: onProductImageAddHandler,
    removeImage: onProductImageDeleteHandler,
    productImages: productImages,
    uploading: uploading,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
