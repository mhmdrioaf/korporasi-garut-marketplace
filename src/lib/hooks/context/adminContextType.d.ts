type TAdminReportTabs = "sales" | "incomes" | "products";

type TAdminContextType = {
  credentials: {
    token: string;
  };

  reports: {
    sales: {
      data: TSalesReportData[] | null | undefined;
      startDate: string | null;
      endDate: string | null;
      year: string | null;

      state: {
        loading: boolean;
        error: any;
        tabs: TAdminReportTabs;
      };

      handler: {
        changeStartDate: (startDate: string | null) => void;
        changeEndDate: (endDate: string | null) => void;
        changeYear: (year: string | null) => void;
        changeTab: (tab: TAdminReportTabs) => void;
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
};
