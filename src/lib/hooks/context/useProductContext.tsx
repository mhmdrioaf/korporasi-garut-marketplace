"use client";

import { TProduct, TProductCategory } from "@/lib/globals";
import {
  NaNHandler,
  fetcher,
  uploadProductImage,
  variantIdGenerator,
  variantItemsIdGenerator,
} from "@/lib/helper";
import { ReactNode, createContext, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import useSWR from "swr";
import { TProductContextType } from "./productContextType";
import { useToast } from "@/components/ui/use-toast";
import imageCompression from "browser-image-compression";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

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

export const ProductContext = createContext<TProductContextType | null>(null);

export function ProductProvider({
  children,
  session,
  product,
}: {
  children: ReactNode;
  session: Session;
  product: TProduct | null;
}) {
  const [productImages, setProductImages] = useState<File[]>([]);
  const [currentProductImages, setCurrentProductImages] = useState<string[]>(
    product?.images ?? []
  );
  const [deletedVariantItems, setDeletedVariantItems] = useState<string[]>([]);
  const [deletedVariant, setDeletedVariant] = useState<string[]>([]);

  const [uploading, setUploading] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<IProductInputs>({
    mode: "onBlur",
    defaultValues: {
      product: {
        title: product?.title,
        description: product?.description,
        category_id: product?.category_id,
        price: product?.price ?? undefined,
        seller_id: product?.seller.user_id.toString(),
        stock: product?.stock,
        unit: product?.unit,
        weight: product?.weight,
      },
      variant: product?.variant,
    },
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
    const currentVariantsLength = variants.fields.length;
    const productId = product
      ? product.id
      : productsList
      ? productsList.result.maxId + 1
      : 1;
    variants.append({
      variant_id: variantIdGenerator(productId, currentVariantsLength + 1),
      variant_title: "",
      variant_item: [],
    });
  };

  const onAddVariantItemHandler = (index: number, value: TVariantInput) => {
    const productId = product
      ? product.id
      : productsList
      ? productsList.result.maxId + 1
      : 1;

    const currentVariantItems = variants.fields.map(
      (variant) => variant.variant_item.length
    );
    const totalLength = currentVariantItems.reduce((a, b) => a + b, 0);
    const variantItemIds = totalLength;
    const itemId = variantItemsIdGenerator(productId, variantItemIds + 1);

    variants.update(index, {
      ...value,
      variant_item: [
        ...value.variant_item,
        {
          variant_item_id: itemId,
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
    const variantItemsIds = product
      ? product.variant.flatMap((variant) =>
          variant.variant_item.map((item) => item.variant_item_id)
        )
      : [];
    if (variantItemsIds.includes(deletedItem.variant_item_id)) {
      setDeletedVariantItems((prev) => [...prev, deletedItem.variant_item_id]);
    }
    variants.update(index, {
      ...value,
      variant_item: newVariantItem,
    });
  };

  const onDeleteVariantHandler = (index: number) => {
    const { id, ...deletedVariant } = variants.fields[index];
    const variantIds = product
      ? product.variant.map((variant) => variant.variant_id)
      : [];
    if (variantIds.includes(deletedVariant.variant_id)) {
      setDeletedVariant((prev) => [...prev, deletedVariant.variant_id]);
    }
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

  const onCurrentProductImageDeleteHandler = (deletedImage: string) => {
    const updatedImageURL = currentProductImages.filter(
      (url) => url !== deletedImage
    );
    setCurrentProductImages(updatedImageURL);
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
        `/PROD-${productId}/${
          product ? product.images.length + (index + 1) : index + 1
        }.jpg`
      );
      if (uploadImage.imageURL) {
        imagesURL.push(uploadImage.imageURL);
      }
    }
    return imagesURL.concat(currentProductImages);
  };

  const resetForm = () => {
    setProductImages([]);
    variants.remove();
    form.reset();
    window.location.reload();
  };

  const onSubmit: SubmitHandler<IProductInputs> = async (data) => {
    setUploading(true);
    const { variant, ...rest } = data;
    const variantsData = variant.map(({ variant_item, ...rest }) => rest);
    const variantItemsData = variant.flatMap((variant) =>
      variant.variant_item.map(({ variant_item_id, ...items }) => items)
    );
    const productsId = product
      ? product.id
      : productsList
      ? productsList.result.maxId + 1
      : 1;
    const imagesURL = await uploadImages(productsId);

    const newProduct = {
      ...rest.product,
      images: imagesURL,
      variant: variantsData.length > 0 ? variantsData : null,
      variant_items: variantItemsData.length > 0 ? variantItemsData : null,
      category_id: rest.product.category_id ?? null,
      seller_id: session.user.id,
      id: productsId,
    };

    const requestBody = product
      ? {
          ...rest.product,
          images: imagesURL,
          variant: data.variant,
          category_id: rest.product.category_id ?? null,
          seller_id: session.user.id,
          id: product.id,
          deletedVariantItems: deletedVariantItems,
          deletedVariant: deletedVariant,
        }
      : {
          ...newProduct,
          secret: session.user.token,
        };

    try {
      const uploadProduct = await fetch(
        product
          ? process.env.NEXT_PUBLIC_API_PRODUCT_UPDATE!
          : process.env.NEXT_PUBLIC_API_PRODUCT_CREATE!,
        {
          method: product ? "PATCH" : "PUT",
          headers: {
            "Content-Type": "application/json",
            Seller_Key: process.env.NEXT_PUBLIC_SELLER_SCRET!,
          },
          body: JSON.stringify(requestBody),
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
    product: product,
    currentImages: currentProductImages,
    removeCurrentImage: onCurrentProductImageDeleteHandler,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
