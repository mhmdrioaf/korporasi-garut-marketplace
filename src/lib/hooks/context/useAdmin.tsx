"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";

interface IAdminProviderProps {
  token: string;
  children: ReactNode;
}

export const AdminContext = createContext<TAdminContextType | null>(null);

export function useAdmin() {
  return useContext(AdminContext) as TAdminContextType;
}

export function AdminProvider({ token, children }: IAdminProviderProps) {
  const [year, setYear] = useState<"2023" | "2024">("2023");
  const [startDate, setStartDate] = useState<string>("01");
  const [endDate, setEndDate] = useState<string>("12");

  const fetcher = (url: string) =>
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
    mutate,
  } = useSWR("/api/report/getSales", fetcher);

  console.log(salesData);

  useEffect(() => {
    if (startDate && endDate) {
      mutate();
    }
  }, [startDate, endDate, mutate]);

  useEffect(() => {
    mutate();
  }, [year, mutate]);

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
        },

        handler: {
          changeStartDate: setStartDate,
          changeEndDate: setEndDate,
          changeYear: setYear,
        },
      },
    },
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
