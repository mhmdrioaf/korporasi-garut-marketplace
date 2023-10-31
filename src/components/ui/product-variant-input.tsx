"use client";

import { useProduct } from "@/lib/hooks/context/useProduct";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Input } from "./input";
import { Button } from "./button";
import { XIcon } from "lucide-react";
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
  const { form, state } = useProduct();

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-3">
        <p className="font-medium">Varian</p>
        <div className="col-span-2 flex flex-col gap-2">
          <div className="grid grid-cols-3">
            <p>Nama Varian</p>
            <div className="col-span-2">
              <Input
                type="text"
                {...form.productForm.register("variant.variant_title")}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3">
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
                    required
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

      <div className="grid grid-cols-3">
        <p className="font-medium">Detail Varian</p>
        <div className="col-span-2">
          <Table>
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
                        {...form.productForm.register(
                          `variant.variant_item.${index}.variant_item_price` as const,
                          {
                            setValueAs: (value) => parseInt(value),
                          }
                        )}
                        required
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
                        required
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
