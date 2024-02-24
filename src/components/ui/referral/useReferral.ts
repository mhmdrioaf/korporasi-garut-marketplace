"use client";

import React from "react";
import { useForm } from "react-hook-form";

type TReferralInput = {
  name: string;
  product_id: number;
};

export function useReferral() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const form = useForm<TReferralInput>({
    mode: "onChange",
  });

  const submit = form.handleSubmit(async (data) => {
    setLoading(true);
    try {
      // await createReferral(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  });

  return {
    loading: loading,
    form: form,
    submit: submit,
  };
}
