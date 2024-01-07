"use client";

import { useAdmin } from "@/lib/hooks/context/useAdmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { decimalDate, getMonthString } from "@/lib/helper";

export default function ReportsDatePicker() {
  const { reports } = useAdmin();
  return (
    <div className="w-full flex flex-col gap-4">
      <p className="font-bold text-primary">Rentang Waktu</p>

      <div className="w-full flex flex-col gap-2">
        <p className="font-bold">Tahun</p>
        <Select
          onValueChange={(value) =>
            reports.sales.handler.changeYear(value as "2023" | "2024")
          }
        >
          <SelectTrigger defaultValue="2023">
            <SelectValue placeholder="2023" />
          </SelectTrigger>
          <SelectContent defaultValue="2023">
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full flex flex-col gap-2">
        <p className="font-bold">Bulan</p>
        <div className="w-full grid place-items-center grid-cols-5">
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

          <div className="col-span-1 flex flex-row items-center justify-center w-full h-[1px] bg-border relative">
            <p className="text-xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2">
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
        </div>
      </div>
    </div>
  );
}
