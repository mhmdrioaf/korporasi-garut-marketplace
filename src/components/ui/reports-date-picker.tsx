"use client";

import { useAdmin } from "@/lib/hooks/context/useAdmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { decimalDate, getMonthString, getSalesYears } from "@/lib/helper";
import { Button } from "./button";

export default function ReportsDatePicker() {
  const { reports } = useAdmin();
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="font-bold text-primary">Rentang Waktu</p>

      <div className="w-full flex flex-row items-center gap-4">
        <div className="w-fit flex flex-col gap-2">
          <p className="font-bold">Tahun</p>
          <Select
            onValueChange={(value) =>
              reports.sales.handler.changeYear(value !== "null" ? value : null)
            }
            disabled={reports.sales.year !== null}
            value={reports.sales.year ?? "null"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih periode tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">Semua</SelectItem>
              {reports.sales.data
                ? getSalesYears(reports.sales.data).map((year) => (
                    <SelectItem value={year} key={year}>
                      {year}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full flex flex-col gap-2">
          <p className="font-bold">Bulan</p>
          <div className="w-full flex flex-row items-center">
            <Select
              onValueChange={(value) =>
                reports.sales.handler.changeStartDate(
                  decimalDate(parseInt(value)).toString()
                )
              }
              disabled={!reports.sales.year}
            >
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Januari" />
              </SelectTrigger>
              <SelectContent defaultValue="0">
                {getMonthString(0, 12).map((month, index) => (
                  <SelectItem value={(index + 1).toString()} key={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex flex-row items-center justify-center w-full h-[1px] bg-border relative">
              <p className="text-nowrap text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2">
                Sampai Dengan
              </p>
            </div>

            <Select
              onValueChange={(value) =>
                reports.sales.handler.changeEndDate(
                  decimalDate(parseInt(value)).toString()
                )
              }
              disabled={!reports.sales.year}
            >
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Desember" />
              </SelectTrigger>
              <SelectContent defaultValue="12">
                {getMonthString(0, 12).map((month, index) => (
                  <SelectItem value={(index + 1).toString()} key={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {reports.sales.year && (
              <Button
                variant="destructive"
                onClick={() => reports.sales.handler.changeYear(null)}
                className="shrink-0"
              >
                Reset Rentang Waktu
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
