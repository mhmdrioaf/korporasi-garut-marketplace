type TAdminContextType = {
  credentials: {
    token: string;
  };

  reports: {
    sales: {
      data: TSalesReportData[] | null | undefined;
      startDate: string | null;
      endDate: string | null;

      state: {
        loading: boolean;
        error: any;
      };

      handler: {
        changeStartDate: React.Dispatch<React.SetStateAction<string | null>>;
        changeEndDate: React.Dispatch<React.SetStateAction<string | null>>;
      };
    };
  };
};
