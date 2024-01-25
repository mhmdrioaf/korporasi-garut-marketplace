"use client";

import { useToast } from "@/components/ui/use-toast";
import { ROUTES } from "@/lib/constants";
import { TProduct } from "@/lib/globals";
import { fetcher, uploadImage } from "@/lib/helper";
import imageCompression from "browser-image-compression";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import useSWR from "swr";
import { IProductInput, TProductContext } from "./productContextType";

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

  const [defaultTags] = useState<string[]>(["smk", "korporasi", "garut"]);

  const [deletedVariantItems, setDeletedVariantItems] = useState<string[]>([]);
  const [deletedVariant, setDeletedVariant] = useState<string | null>(null);

  const [withVariants, setWithVariants] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);

  const [productTags, setProductTags] = useState<string[]>(
    product ? product.tags : defaultTags
  );

  const [uploading, setUploading] = useState(false);

  const { data: productsList } = useSWR("/api/product/list", fetcher);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<IProductInput>({
    mode: "onBlur",
    defaultValues: {
      product: {
        title: product?.title,
        unit: product?.unit,
        description: product?.description,
        expire_date: product
          ? new Date(product.expire_date).toISOString().substring(0, 10)
          : undefined,
        price: product?.price,
        stock: product?.stock,
        capable_out_of_town: product?.capable_out_of_town ?? false,
        category_id: product?.category_id,
        seller_id: product?.seller.user_id.toString(),
        storage_period: product?.storage_period,
        weight: product?.weight,
        images: product?.images,
      },
      variant:
        product && product.variant
          ? {
              variant_id: product.variant.variant_id,
              variant_title: product.variant.variant_title,
              variant_item: product.variant.variant_item.map((item) => ({
                variant_item_id: item.variant_item_id,
                variant_item_name: item.variant_name,
                variant_item_price: item.variant_price,
                variant_item_stock: item.variant_stock,
              })),
            }
          : null,
    },
  });

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

  const onWithVariantsChangeHandler = useCallback(
    (value: "true" | "false") => {
      setWithVariants(value === "true");
      if (value === "true") {
        if (product && product.variant) {
          setDeletedVariant(null);
        } else {
          variantItems.append({
            variant_item_id: "",
            variant_item_name: "",
            variant_item_price: 0,
            variant_item_stock: 0,
          });
        }
      } else {
        if (product && product.variant) {
          setDeletedVariant(product.variant.variant_id);
          setWithVariants(false);
        } else {
          variantItems.remove();
          form.setValue("variant", null);
        }
      }
    },
    [product, variantItems, form]
  );

  const onAddVariantItemsHandler = () => {
    variantItems.append({
      variant_item_id: "",
      variant_item_name: "",
      variant_item_price: 0,
      variant_item_stock: 0,
    });
  };

  const onRemoveVariantItemsHandler = (index: number) => {
    const variantItemToDelete = variantItems.fields[index];
    const { variant_item_id } = variantItemToDelete;

    if (variant_item_id.length) {
      setDeletedVariantItems((prev) => [...prev, variant_item_id]);
    }

    variantItems.remove(index);
  };

  const onRemoveVariantHandler = () => {
    setWithVariants(false);
    form.setValue("variant", null);
  };

  const onRemoveCurrentVariantHandler = (id: string) => {
    setDeletedVariant(id);
    onWithVariantsChangeHandler("false");
  };

  const onRemoveCurrentVariantItemHandler = (id: string) => {
    setDeletedVariantItems((prev) => [...prev, id]);
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
    setProductTags(defaultTags);
    setProductImages([]);
  }

  const onSubmit: SubmitHandler<IProductInput> = async (data) => {
    setUploading(true);

    const { stock, seller_id, images, price, ...productData } = data.product;

    const productsId = product
      ? product.id
      : productsList
        ? productsList.result.maxId + 1
        : 1;

    try {
      const imagesURL = await uploadImages(productsId);

      const productPrice =
        withVariants && data.variant
          ? data.variant.variant_item[0].variant_item_price
          : price;

      const res = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_CREATE!, {
        method: "PUT",
        headers: {
          secret: session.user.token,
        },
        body: JSON.stringify({
          product: {
            ...productData,
            price: productPrice,
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
        router.push(ROUTES.USER.PRODUCTS_LIST);
      }
    } catch (error) {
      setUploading(false);
      console.error("An error occurred: ", error);
    }
  };

  const onUpdate: SubmitHandler<IProductInput> = async (data) => {
    setUploading(true);

    if (!product) {
      setUploading(false);
      console.error("Produk tidak ditemukan");
    } else {
      const { stock, seller_id, images, price, ...productData } = data.product;

      try {
        const imagesURL = await uploadImages(product.id);

        const res = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_UPDATE!, {
          method: "PATCH",
          headers: {
            secret: session.user.token,
          },
          body: JSON.stringify({
            product: {
              ...productData,
              price: data.variant
                ? data.variant.variant_item[0].variant_item_price
                : price,
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
            variant: data.variant ? data.variant : null,
            tags: productTags,
            id: product.id,
            deletedVariant: deletedVariant,
            deletedVariantItems: deletedVariantItems,
          }),
        });

        const response = await res.json();
        if (!response.ok) {
          setUploading(false);
          toast({
            variant: "destructive",
            title: "Gagal mengubah data produk",
            description: response.message,
          });
        } else {
          setUploading(false);
          toast({
            variant: "success",
            title: "Berhasil mengubah data produk",
            description: response.message,
          });
          router.push(ROUTES.USER.PRODUCTS_LIST);
          router.refresh();
        }
      } catch (error) {
        setUploading(false);
        console.error("An error occurred: ", error);
      }
    }
  };

  useEffect(() => {
    if (product && product.variant && !deletedVariant) {
      setWithVariants(true);
    }
  }, [product, deletedVariant]);

  useEffect(() => {
    if (product) {
      setIsEdit(true);
    }
  }, [product]);

  useEffect(() => {
    if (isEdit) {
      if (product && product.variant && !deletedVariant) {
        onWithVariantsChangeHandler("true");
      }
    }
  }, [isEdit, product, onWithVariantsChangeHandler, deletedVariant]);

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
        updateProduct: onUpdate,
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
      isEdit: isEdit,
    },
    currentProduct: product ? product : null,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
