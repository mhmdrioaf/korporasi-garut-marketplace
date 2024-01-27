"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useSWR from "swr";
import { Chart as ChartJS, registerables } from "chart.js";
import { fetcher, filterSalesByDateRange } from "@/lib/helper";
import { TProduct } from "@/lib/globals";
import { DateRange } from "react-day-picker";
import { TAdminContextType, TAdminReportTabs } from "./adminContextType";

interface IAdminProviderProps {
  token: string;
  children: ReactNode;
}

export const AdminContext = createContext<TAdminContextType | null>(null);

export function useAdmin() {
  return useContext(AdminContext) as TAdminContextType;
}

export function AdminProvider({ token, children }: IAdminProviderProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [tab, setTab] = useState<TAdminReportTabs>("sales");
  const [productDetail, setProductDetail] = useState<{
    product: TProduct | null;
    open: boolean;
  }>({
    product: null,
    open: false,
  });

  const customFetcher = useCallback(
    async (url: string) => {
      async function fetchData(url: string) {
        const res = await fetch(url, {
          method: "GET",
          headers: {
            key: token,
          },
        });

        const response = await res.json();
        return response.data as TSalesReportData[] | null;
      }

      const data = await fetchData(url);

      return data;
    },
    [token]
  );

  const {
    data: salesData,
    isLoading: salesReportLoading,
    error: salesReportError,
  } = useSWR("/api/report/getSales", customFetcher);

  const {
    data: preordersData,
    isLoading: preordersReportLoading,
    error: preordersReportError,
  } = useSWR("/api/report/preorders", customFetcher);

  const { data: productsData, isLoading: productsDataLoading } = useSWR(
    "/api/product/list",
    fetcher
  );

  function changeTab(tab: TAdminReportTabs) {
    setTab(tab);
  }

  function getSalesData() {
    if (salesData) {
      if (date) {
        return filterSalesByDateRange(salesData, date.from, date.to);
      } else {
        return salesData;
      }
    } else {
      return [];
    }
  }

  function onProductDetailModalOpen(product: TProduct) {
    setProductDetail({
      product: product,
      open: true,
    });
  }

  function onProductDetailClose() {
    setProductDetail({
      product: null,
      open: false,
    });
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
        date: date,

        state: {
          loading: salesReportLoading,
          error: salesReportError,
          tabs: tab,
        },

        handler: {
          changeDate: setDate,
          changeTab: changeTab,
        },
      },

      preorders: {
        data: preordersData ? preordersData : [],
        state: {
          loading: preordersReportLoading,
          error: preordersReportError,
        },
      },
    },

    products: {
      loading: productsDataLoading,
      data: productsData ? productsData.result.products : null,
    },

    state: {
      product_detail: {
        product: productDetail.product,
        isOpen: productDetail.open,
        onOpen: onProductDetailModalOpen,
        onClose: onProductDetailClose,
      },
    },
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
