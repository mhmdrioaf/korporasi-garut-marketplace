"use client";

import { createReferrer, getReferrer } from "@/lib/actions/referrer";
import { Button } from "../button";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { useFormState } from "react-dom";
import { useReferral } from "./useReferral";

interface IReferralGeneratorProps {
  products: TProduct[];
  user_id: number;
}

const initialState = {
  result: null,
  message: "",
};

const initialReferrerResult = {
  url: "",
  message: "",
};

export default function ReferralGenerator({
  products,
  user_id,
}: IReferralGeneratorProps) {
  const { linkRef, handler } = useReferral();
  const [state, getReferrerAction] = useFormState(getReferrer, initialState);

  const createWithUserId = createReferrer.bind(
    null,
    user_id,
    state.result?.referrer_id ?? ""
  );
  const [referrerResult, createReferrerAction] = useFormState(
    createWithUserId,
    initialReferrerResult
  );

  const resetReferralId = () => {
    if (window) {
      window.location.reload();
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <form
        className="w-full flex flex-col gap-4 text-sm"
        action={getReferrerAction}
      >
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="referrer_id">ID Referral</label>
          <div className="w-full inline-flex items-center gap-2">
            <Input
              type="text"
              required
              name="referrer_id"
              id="referrer_id"
              placeholder="Isi dengan NISN/NIP atau Referral ID yang terdaftar di SMKS Korporasi Garut"
              disabled={state.result !== null}
            />
            {state.result && (
              <Button
                variant="default"
                onClick={resetReferralId}
                type="button"
                className="w-fit shrink-0"
              >
                Ganti Referral
              </Button>
            )}
          </div>
          {state.message && (
            <p className="text-destructive font-medium text-xs">
              {state.message}
            </p>
          )}
        </div>

        {!state.result && (
          <Button variant="default" type="submit">
            Buat Tautan
          </Button>
        )}
      </form>

      {state.result && (
        <>
          <form
            className="w-full flex flex-col gap-4 text-sm"
            action={createReferrerAction}
          >
            <div className="w-full flex flex-col gap-2">
              <label htmlFor="product_id">Produk</label>
              <Select name="product_id" required>
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

          {referrerResult.url && (
            <div className="w-full flex flex-col gap-2">
              <p className="font-bold">Link Referral</p>
              <div className="w-full flex flex-row items-center gap-2">
                <Input type="text" ref={linkRef} value={referrerResult.url} />
                <Button variant="default" onClick={handler.copyToClipboard}>
                  Salin
                </Button>
              </div>
            </div>
          )}

          {referrerResult.message && (
            <p className="text-destructive font-medium text-xs">
              {referrerResult.message}
            </p>
          )}
        </>
      )}

      {/* {state.generatedLink && (
        <div className="w-full flex flex-col gap-2">
          <p className="font-bold">Link Referral</p>
          <div className="w-full flex flex-row items-center gap-2">
            <Input type="text" ref={linkRef} value={state.generatedLink} />
            <Button variant="default" onClick={handler.copyToClipboard}>
              Salin
            </Button>
          </div>
        </div>
      )} */}
    </div>
  );
}
