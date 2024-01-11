type TAdminReportTabs = "sales" | "incomes" | "products";

type TAdminContextType = {
  credentials: {
    token: string;
  };

  reports: {
    sales: {
      data: TSalesReportData[] | null | undefined;
      startDate: string;
      endDate: string;
      year: string;

      state: {
        loading: boolean;
        error: any;
        tabs: TAdminReportTabs;
      };

      handler: {
        changeStartDate: React.Dispatch<React.SetStateAction<string>>;
        changeEndDate: React.Dispatch<React.SetStateAction<string>>;
        changeYear: (year: string) => void;
        changeTab: (tab: TAdminReportTabs) => void;
      };
    };
  };

  products: {
    loading: boolean;
    data: TProduct[] | null;
  };
};
