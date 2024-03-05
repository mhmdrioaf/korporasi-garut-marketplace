"use client";

import React from "react";
import { useToast } from "../use-toast";

export function useReferral() {
  const [isCopied, setIsCopied] = React.useState<boolean>(false);

  const textRef = React.useRef<HTMLInputElement>(null);
  const form = React.useRef<HTMLFormElement>(null);

  const { toast } = useToast();

  const copyToClipboard = () => {
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.value);
      setIsCopied(true);
      toast({
        description: "Tautan telah disalin.",
      });
    }
  };

  const resetForm = () => {
    if (form.current) {
      form.current.reset();
    }
  };

  return {
    form: form,

    handler: {
      copyToClipboard,
      resetForm,
    },

    state: {
      isCopied,
    },

    linkRef: textRef,
  };
}
