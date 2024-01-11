"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR, { useSWRConfig } from "swr";
import { Chart as ChartJS, registerables } from "chart.js";
import { fetcher } from "@/lib/helper";

interface IAdminProviderProps {
  token: string;
  children: ReactNode;
}

export const AdminContext = createContext<TAdminContextType | null>(null);

export function useAdmin() {
  return useContext(AdminContext) as TAdminContextType;
}

export function AdminProvider({ token, children }: IAdminProviderProps) {
  const [year, setYear] = useState<string>("2023");
  const [startDate, setStartDate] = useState<string>("01");
  const [endDate, setEndDate] = useState<string>("12");
  const [tab, setTab] = useState<TAdminReportTabs>("sales");

  const customFetcher = (url: string) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        token: token,
        startDate: startDate ? `${year}-${startDate}-01` : `${year}-01-01`,
        endDate: endDate ? `${year}-${endDate}-31` : `${year}-12-31`,
      }),
    })
      .then((res) => res.json())
      .then((response) => response.data as TSalesReportData[] | null);

  const {
    data: salesData,
    isLoading: salesReportLoading,
    error: salesReportError,
  } = useSWR("/api/report/getSales", customFetcher);

  const { mutate } = useSWRConfig();

  const { data: productsData, isLoading: productsDataLoading } = useSWR(
    "/api/product/list",
    fetcher
  );

  function changeTab(tab: TAdminReportTabs) {
    setTab(tab);
  }

  useEffect(() => {
    if (startDate || endDate) {
      mutate("/api/report/getSales");
    }
  }, [startDate, endDate, mutate]);

  useEffect(() => {
    if (year) {
      mutate("/api/report/getSales");
    }
  }, [year, mutate]);

  useEffect(() => {
    ChartJS.register(...registerables);
  }, []);

  const value: TAdminContextType = {
    credentials: {
      token: token,
    },
    reports: {
      sales: {
        data: salesData,
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
