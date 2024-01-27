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
    <div className="flex flex-row items-center gap-4 self-end justify-end">
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
            showOutsideDays
            fixedWeeks
          />
        </PopoverContent>
      </Popover>

      <Button
        variant={reports.sales.date ? "destructive" : "ghost"}
        disabled={!reports.sales.date}
        onClick={() => reports.sales.handler.changeDate(undefined)}
      >
        Reset Rentang Waktu
      </Button>
    </div>
  );
}
