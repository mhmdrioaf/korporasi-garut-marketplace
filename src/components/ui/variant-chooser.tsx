"use client";

import Modal from "./modal";
import { useDirectPurchase } from "@/lib/hooks/context/useDirectPurchase";
import { Button } from "./button";
import { rupiahConverter } from "@/lib/helper";

interface IVariantChooserProps {
  isOpen: boolean;
  variant: TProductVariant | null;
}

export default function VariantChooser({
  isOpen,
  variant,
}: IVariantChooserProps) {
  const { variants, state, order, cart } = useDirectPurchase();

  async function chooserCallback() {
    const _ctx = state.variantChooserContext;

    if (_ctx === "buy") {
      order.handler.onOrder();
    } else if (_ctx === "cart") {
      await cart.handler.onAddToCart();
    } else if (_ctx === "common") {
      variants.handler.closeVariantChooser();
    } else {
      throw new Error("Variant Chooser Context is not defined!");
    }
  }

  return state.isVariantChooserOpen && variant ? (
    <Modal defaultOpen={isOpen} onClose={variants.handler.closeVariantChooser}>
      <div className="w-full flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
        <div className="flex flex-col gap-2">
          <p className="text-2xl text=primary font-bold">Pilih Varian Produk</p>
          <p className="text-sm">
            Silahkan pilih salah satu varian produk di bawah ini untuk
            melanjutkan.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {variant.variant_item.map((item) => (
            <Button
              variant={
                variants.variantValue
                  ? variants.variantValue.variant_item_id ===
                    item.variant_item_id
                    ? "default"
                    : "ghost"
                  : "ghost"
              }
              key={item.variant_item_id}
              onClick={() => variants.handler.onVariantsChange(item)}
            >
              {item.variant_name}
            </Button>
          ))}
        </div>

        <div className="w-full rounded-md border border-input flex flex-col gap-2 p-2">
          <div className="grid grid-cols-2">
            <p className="font-bold">Harga Varian</p>
            <p>
              {variants.variantValue
                ? rupiahConverter(variants.variantValue.variant_price)
                : rupiahConverter(0)}
            </p>
            <p className="font-bold">Stok Varian</p>
            <p>
              {variants.variantValue
                ? variants.variantValue.variant_stock
                : variant.variant_item.reduce(
                    (acc, curr) => acc + curr.variant_stock,
                    0
                  )}
            </p>
          </div>
        </div>

        <Button
          variant={variants.variantValue ? "default" : "secondary"}
          onClick={
            !variants.variantValue
              ? variants.handler.closeVariantChooser
              : chooserCallback
          }
        >
          {!variants.variantValue ? "Batalkan" : "Simpan"}
        </Button>
      </div>
    </Modal>
  ) : null;
}
