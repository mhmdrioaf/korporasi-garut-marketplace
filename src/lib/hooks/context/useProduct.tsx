"use client";

import { TProduct } from "@/lib/globals";
import { Session } from "next-auth";
import { ReactNode, createContext, useContext, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { IProductInput, TProductContext } from "./productContextType";
import { fetcher, uploadImage } from "@/lib/helper";
import imageCompression from "browser-image-compression";
import useSWR from "swr";
import { useToast } from "@/components/ui/use-toast";

interface IProductProviderProps {
  children: ReactNode;
  product?: TProduct;
  session: Session;
}

export const ProductContext = createContext<TProductContext | null>(null);

export function useProduct() {
  return useContext(ProductContext) as TProductContext;
}

export function ProductProvider({
  product,
  session,
  children,
}: IProductProviderProps) {
  const [productImages, setProductImages] = useState<File[]>([]);
  const [currentProductImages, setCurrentProductImages] = useState<string[]>(
    product?.images ?? []
  );

  const [deletedVariantItems, setDeletedVariantItems] = useState<string[]>([]);
  const [deletedVariant, setDeletedVariant] = useState<string | null>(null);

  const [withVariants, setWithVariants] = useState<boolean>(false);

  const [productTags, setProductTags] = useState<string[]>(
    product ? product.tags : ["smk korporasi garut", "smk", "agribisnis"]
  );

  const [uploading, setUploading] = useState(false);

  const { data: productCategories, isLoading: categoriesLoading } = useSWR(
    "/api/category/list",
    fetcher
  );
  const { data: productsList } = useSWR("/api/product/list", fetcher);

  const { toast } = useToast();

  const form = useForm<IProductInput>({
    mode: "onBlur",
    defaultValues: {
      product: {
        title: product?.title,
        unit: product?.unit,
        description: product?.description,
        expire_date: product?.expire_date,
        price: product?.price,
        stock: product?.stock,
        capable_out_of_town: product?.capable_out_of_town ?? false,
        category_id: product?.category_id,
        seller_id: product?.seller.user_id.toString(),
        storage_period: product?.storage_period,
        weight: product?.weight,
        images: product?.images,
      },
      variant: {
        variant_id: product?.variant?.variant_id,
        variant_item: product?.variant?.variant_item.map((item) => ({
          variant_item_name: item.variant_name,
          variant_item_price: item.variant_price,
          variant_item_stock: item.variant_stock,
        })),
        variant_title: product?.variant?.variant_title,
      },
    },
  });

  const variantName = form.watch("variant.variant_title");

  const variantItems = useFieldArray({
    name: "variant.variant_item",
    control: form.control,
  });

  const watchVariantItems = form.watch("variant.variant_item");
  const controlledVariantItems =
    variantItems.fields.length > 0
      ? variantItems.fields.map((field, index) => {
          return {
            ...field,
            ...watchVariantItems[index],
          };
        })
      : [];

  const onWithVariantsChangeHandler = (value: "true" | "false") => {
    setWithVariants(value === "true");
    if (value === "true") {
      variantItems.append({
        variant_item_name: "",
        variant_item_price: 0,
        variant_item_stock: 0,
      });
    } else {
      variantItems.remove();
      form.setValue("variant", null);
    }
  };

  const onAddVariantItemsHandler = () => {
    variantItems.append({
      variant_item_name: "",
      variant_item_price: 0,
      variant_item_stock: 0,
    });
  };

  const onRemoveVariantItemsHandler = (index: number) => {
    variantItems.remove(index);
  };

  const onRemoveVariantHandler = () => {
    setWithVariants(false);
    form.setValue("variant", null);
  };

  const onRemoveCurrentVariantHandler = (id: string) => {
    setDeletedVariant(id);
    form.setValue("variant", null);
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

      const productImage = await uploadImage(
        compressedImage,
        `/PROD-${productId}/${
          product ? product.images.length + (index + 1) : index + 1
        }.jpg`,
        "products"
      );
      if (productImage.imageURL) {
        imagesURL.push(productImage.imageURL);
      }
    }
    return imagesURL.concat(currentProductImages);
  };

  function resetForm() {
    form.reset();
    variantItems.remove();
  }

  const onSubmit: SubmitHandler<IProductInput> = async (data) => {
    setUploading(true);

    const { stock, seller_id, images, ...productData } = data.product;

    const productsId = product
      ? product.id
      : productsList
      ? productsList.result.maxId + 1
      : 1;

    try {
      const imagesURL = await uploadImages(productsId);

      const res = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_CREATE!, {
        method: "PUT",
        headers: {
          secret: session.user.token,
        },
        body: JSON.stringify({
          product: {
            ...productData,
            seller_id: session.user.id,
            stock:
              controlledVariantItems.length > 0
                ? controlledVariantItems.reduce(
                    (acc, item) => acc + item.variant_item_stock,
                    0
                  )
                : stock,
            images: imagesURL,
          },
          variant: data.variant,
          tags: productTags,
          id: productsId,
        }),
      });

      const response = await res.json();
      if (!response.ok) {
        setUploading(false);
        toast({
          variant: "destructive",
          title: "Gagal menambahkan produk",
          description: response.message,
        });
      } else {
        setUploading(false);
        toast({
          variant: "success",
          title: "Berhasil menambahkan produk",
          description: response.message,
        });
        resetForm();
      }
    } catch (error) {
      setUploading(false);
      console.error("An error occurred: ", error);
    }
  };

  const value: TProductContext = {
    form: {
      productForm: form,
      variant: {
        items: controlledVariantItems,
        withVariants: withVariants,
        handler: {
          add: onWithVariantsChangeHandler,
          addItem: onAddVariantItemsHandler,
          remove: onRemoveVariantHandler,
          removeItem: onRemoveVariantItemsHandler,
          removeCurrent: onRemoveCurrentVariantHandler,
        },
      },
      handler: {
        submitProduct: onSubmit,
      },
    },
    images: {
      images: productImages,
      current: currentProductImages,
      handler: {
        add: onProductImageAddHandler,
        currentImageRemove: onCurrentProductImageDeleteHandler,
        remove: onProductImageDeleteHandler,
      },
    },
    tags: {
      current: productTags,
      handler: {
        add: setProductTags,
      },
    },
    state: {
      uploading: uploading,
    },
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
