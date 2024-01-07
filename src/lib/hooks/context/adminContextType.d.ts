type TAdminContextType = {
  credentials: {
    token: string;
  };

  reports: {
    sales: {
      data: TSalesReportData[] | null | undefined;
      startDate: string;
      endDate: string;
      year: "2023" | "2024";

      state: {
        loading: boolean;
        error: any;
      };

      handler: {
        changeStartDate: React.Dispatch<React.SetStateAction<string>>;
        changeEndDate: React.Dispatch<React.SetStateAction<string>>;
        changeYear: (year: "2023" | "2024") => void;
      };
    };
  };
};
