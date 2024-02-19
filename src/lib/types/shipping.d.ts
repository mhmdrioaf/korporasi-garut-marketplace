type TShippingCost = {
  code: string;
  name: string;
  costs: TShippingCostService[];
};

type TShippingCostService = {
  service: string;
  description: string;
  cost: TShippingCostServiceCost[];
};

type TShippingCostServiceCost = {
  value: number;
  etd: string;
  note: string;
};

type TSameDayShippingResult = {
  travelDistance: number;
  travelDuration: number;
};
