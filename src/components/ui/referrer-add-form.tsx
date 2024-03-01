"use client";

import { addReferrer } from "@/lib/actions/referrer";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";

export default function ReferrerAddForm() {
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const response = await addReferrer(data);
    if (!response.ok) {
      setLoading(false);
      toast({
        variant: "destructive",
        description:
          "Terjadi kesalahan ketika menambahkan referral, silakan coba lagi nanti.",
      });
    } else {
      setLoading(false);
      toast({
        variant: "success",
        description: "Referral berhasil ditambahkan.",
      });
      router.back();
    }
  };

  return (
    <form className="w-full flex flex-col gap-4" action={onSubmit}>
      <div className="w-full flex flex-col gap-2">
        <Label htmlFor="referral_id">ID Referral</Label>
        <Input
          type="text"
          aria-label="ID Referral"
          placeholder="ID Referral"
          name="referral_id"
          id="referral_id"
          required
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
