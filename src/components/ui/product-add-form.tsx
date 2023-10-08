"use client";

import { Label } from "./label";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";
import { Separator } from "./separator";
import { Loader2Icon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import ProductImageAdd from "../product-image-add";
import { ProductContext } from "@/lib/hooks/context/useProductContext";
import { TProductContextType } from "@/lib/hooks/context/productContextType";

export default function ProductAddForm() {
  const {
    addVariant,
    addVariantItem,
    removeVariant,
    removeVariantItem,
    productForm,
    variantsField,
    submitProduct,
    productCategories,
    loadingCategories,
    uploading,
    product,
  } = useContext(ProductContext) as TProductContextType;

  const [isVariant, setIsVariant] = useState<boolean>(
    product ? product.variant.length > 0 : false
  );

  const isVariantChangeHandler = (value: string) => {
    if (value === "true") {
      setIsVariant(true);
      addVariant();
    } else {
      setIsVariant(false);
      variantsField.forEach((_, index) => removeVariant(index));
    }
  };

  useEffect(() => {
    if (variantsField.length < 1) {
      setIsVariant(false);
    }
  }, [variantsField]);

  return (
    <form
      onSubmit={productForm.handleSubmit(submitProduct)}
      className="w-full rounded-md flex flex-col gap-8"
    >
      <ProductImageAdd />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="product.name">Nama Produk</Label>
          <Input
            disabled={uploading}
            type="text"
            placeholder="Nama produk..."
            id="product.name"
            {...productForm.register("product.title")}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product.price">Harga Produk</Label>
          <Input
            disabled={uploading}
            type="number"
            min={0}
            placeholder="15000"
            id="product.price"
            {...productForm.register("product.price", {
              valueAsNumber: true,
            })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product.stock">Stok Produk</Label>
          <Input
            disabled={uploading}
            type="number"
            min={0}
            placeholder="300"
            id="product.stock"
            {...productForm.register("product.stock", {
              valueAsNumber: true,
            })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product.unit">
            {"Unit produk (Contoh: Pot/bungkus/karung )"}
          </Label>
          <Input
            disabled={uploading}
            type="text"
            placeholder="Bungkus"
            id="product.unit"
            {...productForm.register("product.unit")}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product.weight">{"Berat Produk (gram)"}</Label>
          <Input
            disabled={uploading}
            type="number"
            min={0}
            placeholder="3000"
            id="product.weight"
            {...productForm.register("product.weight", {
              valueAsNumber: true,
            })}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="product.description">Deskripsi Produk</Label>
          <Textarea
            rows={16}
            placeholder="Produk ini merupakan..."
            id="product.description"
            disabled={uploading}
            {...productForm.register("product.description")}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="isVariant" className="font-bold text-primary">
            Apakah produk ini memiliki berbagai varian?
          </Label>
          <Select
            disabled={uploading}
            onValueChange={isVariantChangeHandler}
            value={`${isVariant}`}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Tidak" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ya</SelectItem>
              <SelectItem value="false">Tidak</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isVariant && (
        <div className="flex flex-col gap-4">
          {variantsField.map((field, index) => (
            <div className="w-full flex flex-col gap-4" key={field.id}>
              <Separator />
              <div className="w-full flex flex-row items-center justify-between gap-2">
                <p className="text-primary font-bold">Varian {index + 1}</p>
                <Button
                  disabled={uploading}
                  variant="destructive"
                  size="icon"
                  type="button"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </div>
              <div className="w-full flex flex-col gap-2">
                <Label htmlFor={`variant.variant-title.${index}`}>
                  Nama Varian
                </Label>
                <Input
                  disabled={uploading}
                  type="text"
                  id={`variant.variant-title.${index}`}
                  placeholder="Warna/Ukuran/Jenis"
                  defaultValue={field.variant_title}
                  {...productForm.register(
                    `variant.${index}.variant_title` as const
                  )}
                  required
                />
              </div>

              <Separator />

              <div className="w-full grid grid-cols-2 gap-4">
                {field.variant_item.map((item, itemIndex) => (
                  <div
                    className="w-full flex flex-col gap-4"
                    key={item.variant_item_id}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="w-full flex flex-row items-center gap-2 justify-between">
                        <Label
                          htmlFor={`variant_item.${itemIndex}.variant_name`}
                        >{`Nama jenis ${field.variant_title} ${
                          itemIndex + 1
                        } (contoh: "Hitam" jika jenis variannya adalah warna)`}</Label>
                        <Button
                          disabled={uploading}
                          variant="destructive"
                          size="icon"
                          type="button"
                          onClick={() => removeVariantItem(index, item, field)}
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        disabled={uploading}
                        id={`variant_item.${itemIndex}.variant_name`}
                        placeholder="Nama jenis varian..."
                        required
                        {...productForm.register(
                          `variant.${index}.variant_item.${itemIndex}.variant_name` as const
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor={`variant_item.${itemIndex}.variant_price`}
                      >{`Harga jenis varian ${itemIndex + 1}`}</Label>
                      <Input
                        disabled={uploading}
                        type="number"
                        min={0}
                        id={`variant_item.${itemIndex}.variant_price`}
                        placeholder="3000"
                        required
                        {...productForm.register(
                          `variant.${index}.variant_item.${itemIndex}.variant_price` as const,
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />
                      <p className="font-bold text-sm">
                        Harga varian merupakan harga tambahan untuk setiap
                        varian yang ditambahkan. Isi dengan <b>0</b> jika tidak
                        ada harga tambahan.
                      </p>
                    </div>
                  </div>
                ))}
                <div
                  className="w-full h-40 text-stone-500 rounded-md border border-input flex flex-col gap-2 items-center justify-center cursor-pointer self-center justify-self-center"
                  onClick={() => addVariantItem(index, field)}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Tambah jenis</span>
                </div>
              </div>
            </div>
          ))}
          <Button
            disabled={uploading}
            variant="default"
            onClick={() => addVariant()}
            type="button"
          >
            Tambah Varian
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label>Kategori Produk</Label>
        <Select
          defaultValue="noCategory"
          onValueChange={(value) =>
            productForm.setValue("product.category_id", value)
          }
          disabled={uploading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="noCategory">Tidak di Kategorikan</SelectItem>
            {loadingCategories && (
              <SelectItem value="loading">Memuat Kategori...</SelectItem>
            )}
            {productCategories &&
              productCategories.map((category) => (
                <SelectItem
                  value={category.category_id}
                  key={category.category_id}
                >
                  {category.category_name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      <Button disabled={uploading} variant="default" type="submit">
        {uploading ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
            <span>Menyimpan</span>
          </>
        ) : (
          "Simpan"
        )}
      </Button>
    </form>
  );
}
