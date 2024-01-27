"use client";

import {
  getDateString,
  getMonthString,
  getPeriodTime,
  getSalesByMonth,
  getSalesYears,
  remoteImageSource,
  rupiahConverter,
} from "@/lib/helper";
import { useAdmin } from "@/lib/hooks/context/useAdmin";
import Image from "next/image";
import { Separator } from "./separator";
import AdminReportExportPDF from "./admin-report-export-pdf";

interface IReportProps {
  adminName: string;
}

export default function ReportsProducts({ adminName }: IReportProps) {
  const { reports } = useAdmin();

  const periodMonths = getPeriodTime(
    parseInt(reports.sales.startDate ?? "1") - 1,
    parseInt(reports.sales.endDate ?? "12")
  );

  if (reports.sales.data && reports.sales.data.length > 0) {
    const salesData = getSalesByMonth(reports.sales.data);
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row items-center justify-between">
          <p className="font-bold text-lg">Penjualan</p>
          <AdminReportExportPDF
            reportsData={reports.sales.data}
            period={{
              month: `${periodMonths.start} sampai dengan ${periodMonths.end}`,
              year:
                reports.sales.year ?? reports.sales.data
                  ? getSalesYears(reports.sales.data).join(" & ")
                  : new Date().getFullYear().toString(),
            }}
            adminName={adminName}
          />
        </div>

        {salesData.salesMonths.map((month) => (
          <div className="w-full flex flex-col gap-2" key={month}>
            <p className="font-bold text-lg">
              {getMonthString(month, month + 1)}
            </p>
            <Separator />
            {salesData.groupedSales[month].map((sale) => (
              <div
                className="w-full flex flex-col gap-2 border border-input rounded-md overflow-hidden p-2"
                key={sale.order_id}
              >
                <p className="font-bold text-lg">
                  Tanggal Pemesanan: {getDateString(sale.order_date)}
                </p>
                <Separator />
                {sale.order_item.map((item) => (
                  <>
                    <div
                      className="w-full grid grid-cols-2 gap-2"
                      key={item.product.id}
                    >
                      <div className="w-full flex flex-row items-center gap-4">
                        <div className="w-24 h-auto aspect-square rounded-md overflow-hidden relative">
                          <Image
                            src={remoteImageSource(item.product.images[0])}
                            fill
                            className="object-cover"
                            alt="foto produk"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="font-bold text-lg">
                            {item.product.title}{" "}
                            {item.variant
                              ? `- ${item.variant.variant_name}`
                              : null}
                          </p>
                          <p className="text-xs">
                            {item.product.seller.account?.user_name}
                          </p>
                          <p className="text-xs">
                            Jumlah: x{item.order_quantity}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 justify-self-end self-center">
                        <p className="font-bold">Harga:</p>
                        <p className="font-bold">
                          {rupiahConverter(
                            item.variant
                              ? item.variant.variant_price
                              : item.product.price
                          )}
                        </p>
                        <p className="font-bold">Total:</p>
                        <p className="font-bold">
                          {rupiahConverter(
                            item.variant
                              ? item.variant.variant_price * item.order_quantity
                              : item.order_quantity * item.product.price
                          )}
                        </p>
                      </div>
                    </div>

                    <Separator />
                  </>
                ))}

                <p className="font-bold text-lg">
                  Total pendapatan:{" "}
                  {rupiahConverter(
                    sale.order_item.reduce(
                      (acc, item) =>
                        acc +
                        item.order_quantity *
                          (item.variant
                            ? item.variant.variant_price
                            : item.product.price),
                      0
                    )
                  )}
                </p>
              </div>
            ))}
            <Separator />
          </div>
        ))}
      </div>
    );
  } else {
    return (
      <p className="w-full text-center text-sm italic">
        Belum ada penjualan pada periode yang dipilih.
      </p>
    );
  }
}
