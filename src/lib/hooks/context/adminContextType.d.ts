import { DateRange } from "react-day-picker";

type TAdminReportTabs =
  | "sales"
  | "incomes"
  | "products"
  | "preorder"
  | "restock";

type TAdminContextType = {
  credentials: {
    token: string;
  };

  reports: {
    sales: {
      data: TSalesReportData[] | null | undefined;
      date: DateRange | undefined;

      state: {
        loading: boolean;
        error: any;
        tabs: TAdminReportTabs;
      };

      handler: {
        changeDate: (date: DateRange | undefined) => void;
        changeTab: (tab: TAdminReportTabs) => void;
      };
    };

    preorders: {
      data: TSalesReportData[];

      state: {
        loading: boolean;
        error: any;
      };
    };
  };

  products: {
    loading: boolean;
    data: TProduct[] | null;
  };

  state: {
    product_detail: {
      product: TProduct | null;
      isOpen: boolean;
      onClose: () => void;
      onOpen: (product: TProduct) => void;
    };
  };

  incomes: {
    data: TIncome[];
  };
};
