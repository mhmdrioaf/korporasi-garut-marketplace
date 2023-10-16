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
  variant: TProductVariant[];
  category_id: string | null;
  category: TProductCategory | null;
  seller: TUser;
  tags: string[];
  status: "APPROVED" | "PENDING" | "REJECTED";
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
  variant_value: string;
  variant_price: number;
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
};

type TOrder = {
  order_id: string;
  order_status: ORDER_STATUS;
  order_date: Date;
  order_delivered_date: Date | null;
  user_id: number;
  shipping_addres: String;
  total_price: number;

  address: TAddress;
  user: TUser;
  order_item: TOrderItem[];
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
  total_price: number;

  address: TAddress;
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
