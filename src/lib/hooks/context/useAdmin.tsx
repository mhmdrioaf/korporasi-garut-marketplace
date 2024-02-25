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
import { DateRange } from "react-day-picker";
import { TAdminContextType, TAdminReportTabs } from "./adminContextType";

interface IAdminProviderProps {
  token: string;
  incomes: TIncome[];
  children: ReactNode;
}

export const AdminContext = createContext<TAdminContextType | null>(null);

export function useAdmin() {
  return useContext(AdminContext) as TAdminContextType;
}

export function AdminProvider({
  token,
  incomes,
  children,
}: IAdminProviderProps) {
  const [date, setDate] = useState<DateRange | undefined>();
  const [tab, setTab] = useState<TAdminReportTabs>("sales");
  const [activeIncomesData, setActiveIncomesData] = useState<
    "PENDING" | "PAID" | "ALL"
  >("ALL");
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

  const { data: productsData, isLoading: productsDataLoading } = useSWR(
    "/api/product/list",
    fetcher
  );

  function changeTab(tab: TAdminReportTabs) {
    setTab(tab);
  }

  function getIncomesData() {
    if (incomes) {
      const incomesData = incomes.filter((income) => {
        if (date && date.from && date.to) {
          return (
            new Date(income.income_date) >= date.from &&
            new Date(income.income_date) <= date.to
          );
        } else {
          return income;
        }
      });

      return incomesData;
    } else {
      return [];
    }
  }

  function getSalesData() {
    if (salesData) {
      return filterSalesByDateRange(salesData, date?.from, date?.to);
    } else {
      return null;
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

  function onDateChanges(date: DateRange | undefined) {
    setDate(date);
    const chart = ChartJS.getChart("report-chart");
    chart?.update();
  }

  function onActiveIncomesDataChange(activeData: "PENDING" | "PAID" | "ALL") {
    setActiveIncomesData(activeData);
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
        data: getSalesData()?.finished ?? [],
        date: date,

        state: {
          loading: salesReportLoading,
          error: salesReportError,
          tabs: tab,
        },

        handler: {
          changeDate: onDateChanges,
          changeTab: changeTab,
        },
      },

      preorders: {
        data: getSalesData()?.preorders ?? [],
        state: {
          loading: salesReportLoading,
          error: salesReportError,
        },
      },
    },

    products: {
      loading: productsDataLoading,
      data: productsData ? productsData.result.products : null,
    },

    incomes: {
      data: getIncomesData(),

      state: {
        activeData: activeIncomesData,
      },

      handler: {
        changeActiveData: onActiveIncomesDataChange,
      },
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
