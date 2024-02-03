"use client";

import { useProduct } from "@/lib/hooks/context/useProduct";
import { Trash2Icon, XIcon } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

export default function ProductVariantInput() {
  const { form, state, currentProduct } = useProduct();

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3">
        <p className="font-medium">Varian</p>
        <div className="col-span-2 flex flex-col gap-2">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <p>Nama Varian</p>
            <div className="col-span-2 flex flex-row items-center gap-2">
              <Input
                type="text"
                {...form.productForm.register("variant.variant_title")}
                required={form.variant.withVariants}
              />
              <Button
                type="button"
                variant="destructive"
                className="flex flex-row gap-2 items-center"
                onClick={() =>
                  currentProduct
                    ? currentProduct.variant
                      ? form.variant.handler.removeCurrent(
                          currentProduct.variant.variant_id
                        )
                      : form.variant.handler.add("false")
                    : form.variant.handler.add("false")
                }
              >
                <Trash2Icon className="w-4 h-4" />
                <p>Hapus</p>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
            <p>Jenis Varian</p>
            <div className="col-span-2 grid grid-cols-1 gap-2">
              {form.variant.items.map((item, index) => (
                <div
                  className="w-full flex flex-row items-center gap-2"
                  key={item.id}
                >
                  <Input
                    key={item.id}
                    type="text"
                    placeholder="Nama jenis varian..."
                    {...form.productForm.register(
                      `variant.variant_item.${index}.variant_item_name` as const
                    )}
                    required={form.variant.withVariants}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => form.variant.handler.removeItem(index)}
                    disabled={state.uploading}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="ghost"
                type="button"
                onClick={form.variant.handler.addItem}
                disabled={state.uploading}
              >
                Tambah Jenis Varian
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        <p className="font-medium">Detail Varian</p>
        <div className="col-span-2 relative overflow-hidden">
          <Table className="w-full overflow-auto">
            <TableCaption>Daftar detail varian produk.</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {form.variant.items.length > 0 &&
                form.variant.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.variant_item_name}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={1}
                        {...form.productForm.register(
                          `variant.variant_item.${index}.variant_item_price` as const,
                          {
                            setValueAs: (value) => parseInt(value),
                          }
                        )}
                        required={form.variant.withVariants}
                        className="w-[12ch] md:w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        {...form.productForm.register(
                          `variant.variant_item.${index}.variant_item_stock` as const,
                          {
                            setValueAs: (value) => parseInt(value),
                          }
                        )}
                        required={form.variant.withVariants}
                        className="w-[6ch] md:w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
