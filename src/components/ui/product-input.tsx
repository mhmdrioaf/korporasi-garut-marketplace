"use client";

import { Input } from "./input";
import { Textarea } from "./textarea";
import ProductImageAdd from "../product-image-add";
import { useProduct } from "@/lib/hooks/context/useProduct";
import { Label } from "./label";
import ProductTagsInput from "./product-tags-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import ProductVariantInput from "./product-variant-input";
import { Loader2Icon } from "lucide-react";
import { Button } from "./button";
import { convertStringToBoolean } from "@/lib/helper";

export default function ProductInput() {
  const { form, state } = useProduct();
  const defaultRadio = form.productForm.getValues(
    "product.capable_out_of_town"
  );

  return (
    <form
      className="w-full flex flex-col gap-8"
      onSubmit={
        state.isEdit
          ? form.productForm.handleSubmit(form.handler.updateProduct)
          : form.productForm.handleSubmit(form.handler.submitProduct)
      }
    >
      {/* Product Informations */}
      <div className="w-full flex flex-col gap-8 rounded-md border border-input p-2">
        <p className="font-bold text-2xl text-primary">Informasi Produk</p>

        <div className="w-full flex flex-col gap-4 px-8 py-2">
          <div className="grid grid-cols-3">
            <p className="font-medium">Foto Produk</p>
            <div className="col-span-2">
              <ProductImageAdd />
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium">Nama Produk</p>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Nama produk..."
                {...form.productForm.register("product.title")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium">Unit Produk</p>
            <div className="col-span-2">
              <Input
                type="text"
                placeholder="Unit produk..."
                {...form.productForm.register("product.unit")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium">Deskripsi Produk</p>
            <div className="col-span-2">
              <Textarea
                rows={16}
                placeholder="Deskripsi produk..."
                {...form.productForm.register("product.description")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium self-center">Kata Kunci Produk</p>
            <div className="col-span-2">
              <ProductTagsInput />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8 rounded-md border border-input p-2">
        <p className="font-bold text-2xl text-primary">Informasi Pengiriman</p>

        <div className="w-full flex flex-col gap-4 px-8 py-2">
          <div className="grid grid-cols-3">
            <p className="font-medium">Tanggal Kedaluwarsa</p>
            <div className="col-span-2">
              <Input
                type="date"
                {...form.productForm.register("product.expire_date", {
                  setValueAs: (value) => new Date(value),
                })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium">Masa Penyimpanan</p>
            <div className="col-span-2">
              <div className="w-full grid grid-cols-4 gap-2">
                <Input
                  type="number"
                  placeholder="Hari..."
                  {...form.productForm.register("product.storage_period", {
                    setValueAs: (value) => parseInt(value),
                  })}
                  className="col-span-3"
                  required
                />
                <p className="place-self-center">Hari</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium">Berat Produk</p>
            <div className="col-span-2">
              <div className="w-full grid grid-cols-4 gap-2">
                <Input
                  type="number"
                  placeholder="Gram..."
                  {...form.productForm.register("product.weight", {
                    setValueAs: (value) => parseInt(value),
                  })}
                  className="col-span-3"
                  required
                />
                <p className="place-self-center">Gram</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium">Dapat dikirimkan ke luar kota?</p>
            <div className="col-span-2">
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-row items-center gap-1">
                  <Input
                    type="radio"
                    value="false"
                    id="capableOutOfTown1"
                    defaultChecked={defaultRadio === false}
                    {...form.productForm.register(
                      "product.capable_out_of_town",
                      {
                        setValueAs: (value) => convertStringToBoolean(value),
                      }
                    )}
                  />
                  <Label htmlFor="capableOutOfTown1" className="text-sm">
                    Tidak
                  </Label>
                </div>

                <div className="flex flex-row items-center gap-1">
                  <Input
                    type="radio"
                    value="true"
                    defaultChecked={defaultRadio === true}
                    id="capableOutOfTown2"
                    {...form.productForm.register(
                      "product.capable_out_of_town",
                      {
                        setValueAs: (value) => convertStringToBoolean(value),
                      }
                    )}
                  />
                  <Label htmlFor="capableOutOfTown2" className="text-sm">
                    Ya
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8 rounded-md border border-input p-2">
        <p className="text-2xl font-bold text-primary">Detail Produk</p>

        <div className="w-full flex flex-col gap-4 px-8 py-2">
          <div className="grid grid-cols-3">
            <p className="font-medium">Harga Produk</p>
            <div className="col-span-2">
              <Input
                type="number"
                {...form.productForm.register("product.price", {
                  setValueAs: (value) => parseInt(value),
                })}
                className="col-span-3"
                required={form.variant.withVariants ? false : true}
              />
            </div>
          </div>

          <div className="grid grid-cols-3">
            <p className="font-medium">Aktifkan Varian?</p>
            <div className="col-span-2">
              <Select
                onValueChange={(value) =>
                  form.variant.handler.add(value as "true" | "false")
                }
                value={`${form.variant.withVariants}`}
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
          {!form.variant.withVariants && (
            <div className="grid grid-cols-3">
              <p className="font-medium">Stok Produk</p>
              <div className="col-span-2">
                <Input
                  type="number"
                  {...form.productForm.register("product.stock", {
                    setValueAs: (value) => parseInt(value),
                  })}
                  className="col-span-3"
                  required={form.variant.withVariants ? false : true}
                />
              </div>
            </div>
          )}

          {form.variant.withVariants && <ProductVariantInput />}
        </div>
      </div>

      <Button variant="default" type="submit" disabled={state.uploading}>
        {state.uploading ? (
          <>
            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
            <p>Menyimpan...</p>
          </>
        ) : (
          "Simpan"
        )}
      </Button>
    </form>
  );
}
