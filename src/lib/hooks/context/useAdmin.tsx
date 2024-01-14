"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR, { useSWRConfig } from "swr";
import { Chart as ChartJS, registerables } from "chart.js";
import { fetcher, filterSalesByDate } from "@/lib/helper";

interface IAdminProviderProps {
  token: string;
  children: ReactNode;
}

export const AdminContext = createContext<TAdminContextType | null>(null);

export function useAdmin() {
  return useContext(AdminContext) as TAdminContextType;
}

export function AdminProvider({ token, children }: IAdminProviderProps) {
  const [year, setYear] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [tab, setTab] = useState<TAdminReportTabs>("sales");

  const customFetcher = useCallback(async () => {
    async function fetchData(url: string) {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          token: token,
        }),
      });

      const response = await res.json();
      return response.data as TSalesReportData[] | null;
    }

    const data = await fetchData("/api/report/getSales");

    return data;
  }, [token]);

  const {
    data: salesData,
    isLoading: salesReportLoading,
    error: salesReportError,
  } = useSWR("/api/report/getSales", customFetcher);

  const { data: productsData, isLoading: productsDataLoading } = useSWR(
    "/api/product/list",
    fetcher
  );

  function changeTab(tab: TAdminReportTabs) {
    setTab(tab);
  }

  function getSalesData() {
    if (salesData) {
      if (year) {
        return filterSalesByDate(year, "01", "12", salesData);
      } else if (startDate && endDate && year) {
        return filterSalesByDate(year, startDate, endDate, salesData);
      } else {
        return salesData;
      }
    } else {
      return [];
    }
  }

  useEffect(() => {
    ChartJS.register(...registerables);
  }, []);

  const value: TAdminContextType = {
    credentials: {
      token: token,
    },
    reports: {
      sales: {
        data: getSalesData(),
        startDate: startDate,
        endDate: endDate,
        year: year,

        state: {
          loading: salesReportLoading,
          error: salesReportError,
          tabs: tab,
        },

        handler: {
          changeStartDate: setStartDate,
          changeEndDate: setEndDate,
          changeYear: setYear,
          changeTab: changeTab,
        },
      },
    },

    products: {
      loading: productsDataLoading,
      data: productsData ? productsData.result.products : null,
    },
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
