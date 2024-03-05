"use client";

import { rupiahConverter } from "@/lib/helper";
import { Container } from "./container";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

interface IUserIncomesProps {
  incomes: TIncome[];
}

export default function UserIncomes({ incomes }: IUserIncomesProps) {
  function getUserIncomeAmount(amount: number) {
    return rupiahConverter(amount * 0.3);
  }

  function getUserTotalIncomesAmount(incomes: TIncome[]) {
    return rupiahConverter(
      incomes.reduce((acc, income) => acc + income.total_income * 0.3, 0)
    );
  }

  function getUserOrderItems(order: TOrder) {
    const itemVariants = order.order_item.map((item) => item.variant);
    const itemProducts = order.order_item.map((item) => item.product);

    return itemVariants.map((variant, idx) => {
      return `${itemProducts[idx].title} ${variant ? "- " + variant.variant_name : ""}\n`;
    });
  }

  return (
    <Container className="w-full flex flex-col gap-4 min-h-screen">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl font-bold text-primary">Pendapatan Referral</p>
        <p className="text-xs">
          Berikut merupakan data pendapatan yang dihasilkan melalui link
          referral yang telah anda bagikan.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-primary hover:bg-primary">
            <TableHead className="text-primary-foreground font-bold text-center">
              No.
            </TableHead>
            <TableHead className="text-primary-foreground font-bold text-center">
              Tanggal
            </TableHead>
            <TableHead className="text-primary-foreground font-bold text-center">
              Produk Terjual
            </TableHead>
            <TableHead className="text-primary-foreground font-bold text-center">
              Pendapatan
            </TableHead>
            <TableHead className="text-primary-foreground font-bold text-center">
              Status Pendapatan
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {incomes.length > 0 ? (
            incomes.map((income, idx) => (
              <TableRow key={income.income_id}>
                <TableCell className="text-center">{idx + 1}</TableCell>
                <TableCell className="text-center">
                  {new Date(income.order.order_date).toLocaleDateString(
                    "id-ID",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {getUserOrderItems(income.order)}
                </TableCell>
                <TableCell className="text-center">
                  {getUserIncomeAmount(income.total_income)}
                </TableCell>
                <TableCell className="text-center">
                  {income.income_status === "PAID"
                    ? "Telah Dibayar"
                    : "Belum Dibayar"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Tidak ada data pendapatan referral yang ditemukan.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow className="hover:bg-primary">
            <TableCell colSpan={4} className="text-right font-bold">
              Total Pendapatan
            </TableCell>
            <TableCell colSpan={2} className="text-center font-bold">
              {getUserTotalIncomesAmount(incomes)}
            </TableCell>
          </TableRow>
        </TableFooter>

        <TableCaption>Detail Pendapatan Referral</TableCaption>
      </Table>
    </Container>
  );
}
