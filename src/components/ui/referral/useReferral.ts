"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../use-toast";
import { ROUTES } from "@/lib/constants";

type TReferralInput = {
  name: string;
  product_id: number;
};

export function useReferral({ products }: { products: TProduct[] }) {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = React.useState<string | null>(null);

  const textRef = React.useRef<HTMLInputElement>(null);
  const form = useForm<TReferralInput>({
    mode: "onChange",
  });

  const { toast } = useToast();

  const submit = form.handleSubmit((data) => {
    const referrerName = data.name;
    const referredProduct = data.product_id;
    const product = products.find((product) => product.id === referredProduct);

    if (product) {
      const origin = window.location.origin;
      const productURL = ROUTES.PRODUCT.DETAIL(product.id.toString());
      const encodedReferrerName = encodeURIComponent(referrerName);
      const url = `${origin}${productURL}?ref=${encodedReferrerName}`;

      setGeneratedLink(url);
    } else {
      toast({
        description: "Produk tidak ditemukan",
      });
    }
  });

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.value);
      setIsCopied(true);
      toast({
        description: "Tautan telah disalin.",
      });
    }
  };

  return {
    form: form,

    handler: {
      submit,
      copyToClipboard,
    },

    state: {
      isCopied,
      generatedLink,
    },

    linkRef: textRef,
  };
}
