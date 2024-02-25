"use client";

import { FormEvent, useState } from "react";
import { Button } from "./button";
import { payIncome } from "@/lib/actions/incomes";
import { useToast } from "./use-toast";
import { Loader2Icon } from "lucide-react";

interface IPayIncomeButtonProps {
  income_id: string;
}

export default function PayIncomeButton({ income_id }: IPayIncomeButtonProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  async function handlePayIncome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    const payIncomeResponse = await payIncome(income_id);

    if (payIncomeResponse.ok) {
      setIsLoading(false);
      toast({
        title: "Berhasil melakukan pembayaran",
        description: "Pembayaran telah berhasil dilakukan",
        variant: "success",
      });
    } else {
      setIsLoading(false);
      toast({
        title: "Gagal melakukan pembayaran",
        description: "Pembayaran gagal dilakukan",
        variant: "destructive",
      });
    }
  }

  return (
    <form className="w-full" onSubmit={handlePayIncome}>
      <Button
        variant="default"
        className="w-full"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
            <p>Menyetor...</p>
          </>
        ) : (
          "Setor"
        )}
      </Button>
    </form>
  );
}
