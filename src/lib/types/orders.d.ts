type TOrder = {
  order_id: string;
  order_status: ORDER_STATUS;
  order_date: Date;
  order_delivered_date: Date | null;
  total_price: number;
  shipping_address: string | null;
  shipping_cost: number;
  delivery_receipt: string | null;
  payment_proof: string | null;
  order_type: ORDER_TYPE;
  eta: number;
  isSameday: boolean;
  shipping_service: string;
  preorder_estimation: Date | null;

  user_id: number;
  order_item: TOrderItem[];
  address: TAddress;
  user: TCustomer;
  income: TIncome;
};

type TOrderItem = {
  order_item_id: string;
  order_quantity: number;
  product_id: number;
  product_variant_id: string | null;

  product: TProduct;
  variant: TProductVariantItem | null;
};

type TIncome = {
  income_id: string;
  total_income: number;
  income_date: Date;
  seller_id: number | null;
  order_id: string;
  income_status: INCOME_STATUS;
  referrer_name: string | null;

  seller: TSeller | null;
  order: TOrder;
};

type ORDER_STATUS =
  | "PENDING"
  | "PAID"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "FINISHED";
type ORDER_TYPE = "NORMAL" | "PREORDER";
type INCOME_STATUS = "PENDING" | "PAID";
