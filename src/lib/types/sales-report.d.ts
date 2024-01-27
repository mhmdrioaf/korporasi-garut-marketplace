type TSalesReportAccount = {
  user_name: string;
};

type TSalesReportUser = {
  user_id: number;
  account: TSalesReportAccount | null;
};

type TSalesReportSeller = TSalesReportUser;

type TSalesReportProduct = {
  id: number;
  images: string[];
  price: number;
  unit: string;
  title: string;
  seller: TSalesReportSeller;
  visitor: number;
  cart_count: number;
  search_count: number;
};

type TSalesReportVariant = {
  variant_item_id: string;
  variant_name: string;
  variant_price: number;
  variant: {
    product: {
      seller_id: number;
    } | null;
  };
};

type TSalesReportOrderItem = {
  order_quantity: number;
  product: TSalesReportProduct;
  variant: TSalesReportVariant | null;
};

type TSalesReportData = {
  order_id: string;
  order_status: string;
  order_date: Date;
  order_delivered_date: Date | null;
  user_id: number;
  total_price: number;
  shipping_address: string | null;
  shipping_cost: number;
  delivery_receipt: string | null;
  payment_proof: string | null;
  order_type: ORDER_TYPE;
  eta: number;
  order_status: ORDER_STATUS;

  user: TSalesReportUser;
  order_item: TSalesReportOrderItem[];
};

type ORDER_STATUS =
  | "PENDING"
  | "PAID"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "FINISHED";
