"use client";

import { Button } from "../button";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { useReferral } from "./useReferral";

interface IReferralGeneratorProps {
  products: TProduct[];
}

export default function ReferralGenerator({
  products,
}: IReferralGeneratorProps) {
  const { form, state, handler, linkRef } = useReferral({ products });

  return (
    <div className="w-full flex flex-col gap-4">
      <form
        className="w-full flex flex-col gap-4 text-sm"
        onSubmit={handler.submit}
      >
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="name">Nama</label>
          <Input
            type="text"
            required
            {...form.register("name")}
            placeholder="Isi dengan nama anda"
          />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="product_id">Produk</label>
          <Select
            onValueChange={(value) =>
              form.setValue("product_id", Number(value))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Silakan pilih salah satu produk yang akan dipasarkan" />
            </SelectTrigger>

            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id.toString()}>
                  {product.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="default" type="submit">
          Buat Tautan
        </Button>
      </form>

      {state.generatedLink && (
        <div className="w-full flex flex-col gap-2">
          <p className="font-bold">Link Referral</p>
          <div className="w-full flex flex-row items-center gap-2">
            <Input type="text" ref={linkRef} value={state.generatedLink} />
            <Button variant="default" onClick={handler.copyToClipboard}>
              Salin
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
