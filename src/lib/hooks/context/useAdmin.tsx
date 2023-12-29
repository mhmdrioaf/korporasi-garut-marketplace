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
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const fetcher = (url: string) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        token: token,
        startDate: startDate ? startDate : "2023-01-01",
        endDate: endDate ? endDate : "2023-12-31",
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

  useEffect(() => {
    if (startDate && endDate) {
      mutate();
    }
  }, [startDate, endDate, mutate]);

  const value: TAdminContextType = {
    credentials: {
      token: token,
    },
    reports: {
      sales: {
        data: salesData,
        startDate: startDate,
        endDate: endDate,

        state: {
          loading: salesReportLoading,
          error: salesReportError,
        },

        handler: {
          changeStartDate: setStartDate,
          changeEndDate: setEndDate,
        },
      },
    },
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
