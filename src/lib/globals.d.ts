import { StaticImageData } from "next/image";

type TCarouselAssets = {
  image: StaticImageData | string;
  title: string;
  descriptions: string | null;
};

type TProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  unit: string;
  weight: number;
  stock: number;
  expire_date: Date;
  storage_period: number;
  capable_out_of_town: boolean;
  variant: TProductVariant | null;
  category_id: string | null;
  category: TProductCategory | null;
  seller: TUser;
  tags: string[];
  status: "APPROVED" | "PENDING" | "REJECTED";
  sold_count: number;
  visitor: number;
  cart_count: number;
  search_count: number;
};

type TProductVariant = {
  variant_id: string;
  variant_title: string;

  product_id: number;
  product: TProduct;
  variant_item: TProductVariantItem[];
};

type TProductVariantItem = {
  variant_item_id: string;
  variant_name: string;
  variant_stock: number;
  variant_price: number;
  pending_order_count: number;
};

type TUser = {
  user_id: number;
  username: string;
  email: string;
  password: string;
  phone_number: string | null;
  role: string;
  createdAt: Date;
  primary_address_id: string | null;
  token: string;
  is_disabled: boolean;

  account: TAccount;
  address: TAddress[];
  orders: TOrder[];
  products: TProduct[];
  cart: TCustomerCart | null;
  notification: TNotification | null;
};

type TOrder = {
  order_id: string;
  order_status: ORDER_STATUS;
  order_date: Date;
  order_delivered_date: Date | null;
  user_id: number;
  shipping_addres: String;
  shipping_cost: number;
  total_price: number;
  delivery_receipt: string | null;
  payment_proof: string | null;
  order_type: ORDER_TYPE;

  address: TAddress;
  user: TUser;
  order_item: TOrderItem[];
};

type TSellerOrder = {
  order_id: string;
  order_status: ORDER_STATUS;
  order_date: Date;
  order_delivered_date: Date | null;
  user_id: number;
  shipping_cost: number;
  total_price: number;
  delivery_receipt: string | null;
  payment_proof: string | null;
  order_type: ORDER_TYPE;

  address: TAddress | null;
  user: {
    account: TAccount | null;
  };
  order_item: {
    order_quantity: number;
    variant: TProductVariantItem | null;
    product: {
      title: string;
      capable_out_of_town: boolean;
      images: string[];
      id: number;
      price: number;
      stock: number;
      storage_period: number;
      expire_date: Date;
      unit: string;
    };
  }[];
};

type TOrderItem = {
  order_item_id: string;
  order_quantity: number;
  order_id: string;
  product_id: string;
  product_variant_id: string;

  orders: TOrder;
  product: TProduct;
  variant: TProductVariantItem | null;
};

type TAccount = {
  account_id: string;
  user_id: number;
  user_name: string;
  profile_picture: string | null;
};

type TCustomerOrder = {
  order_id: string;
  order_status: ORDER_STATUS;
  order_date: Date;
  order_delivered_date: Date | null;
  customer_id: string;
  shipping_addres: String;
  shipping_cost: number;
  total_price: number;
  delivery_receipt: string | null;
  payment_proof: string | null;
  order_type: ORDER_TYPE;

  address: TAddress | null;
  user: TUser;
  order_item: TOrderItem[];
};

type TOrderItem = {
  order_item_id: string;
  order_quantity: number;
  customer_id: string;
  product: TProduct;
};

type TProductCategory = {
  category_id: string;
  category_name: string;
  products: TProduct[];
};

type ORDER_STATUS =
  | "PENDING"
  | "PAID"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "FINISHED";

type TAddress = {
  address_id: string;
  city: TCity;
  full_address: string;
  label: string;
  user_id: number;
  recipient_name: string;
  recipient_phone_number: string;
  village: string;
  district: string;
  latidude: number;
  longitude: number;
};

type TDistrict = {
  code: string;
  name: string;
};

type TVillage = {
  code: string;
  name: string;
};

type TProvince = {
  province_id: string;
  province: string;
};

type TCity = {
  city_id: string;
  city_name: string;
  province_id: string;
  province: string;
  type: string;
  postal_code: string;
};

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

type TCustomerCart = {
  cart_id: string;
  user_id: number;
  total_price: number;
  total_weight: number;

  cart_items: TCustomerCartItem[];
  user: TUser;
};

type TCustomerCartItem = {
  cart_item_id: string;
  cart_id: string;
  product_id: number;
  product_variant_item_id: string;
  quantity: number;

  cart: TCustomerCart;
  product: TProduct;
  variant: TProductVariantItem | null;
};

type TCustomerCartGroupedBySeller = {
  seller: TUser;
  products: TCustomerCartItem[];
};

type TNotification = {
  notification_id: string;
  subscriber_id: number;
  items: TNotificationItem[];
};

type TNotificationItem = {
  notification_item_id: string;
  notification_id: string;
  title: string;
  description: string | null;
  redirect_url: string | null;
  notifiedAt: Date;
  show_action_button: boolean;
  status: NOTIFICATION_STATUS;
};

type TSameDayShippingResult = {
  travelDistance: number;
  travelDuration: number;
};

type NOTIFICATION_STATUS = "UNREAD" | "READ";

type ORDER_TYPE = "NORMAL" | "PREORDER";
