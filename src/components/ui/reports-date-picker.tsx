"use client";

import { useAdmin } from "@/lib/hooks/context/useAdmin";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./calendar";

export default function ReportsDatePicker() {
  const { reports } = useAdmin();
  return (
    <div className="w-full flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="default">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {reports.sales.date?.from ? (
              reports.sales.date.to ? (
                <>
                  {format(reports.sales.date.from, "LLL dd, y")} -{" "}
                  {format(reports.sales.date.to, "LLL dd, y")}
                </>
              ) : (
                format(reports.sales.date.from, "LLL dd, y")
              )
            ) : (
              <span>Pilih Rentang Waktu</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={reports.sales.date?.from}
            selected={reports.sales.date}
            onSelect={reports.sales.handler.changeDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
