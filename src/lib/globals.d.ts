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
};

type TProductVariant = {
  variant_id: string;
  variant_title: string;
  variant_value: string;
  variant_price: number;

  product_id: number;
  product: TProduct;
};

type TUser = {
  account: TAccount | null;
  user_id: number;
  username: string;
  email: string;
  phone_number: string | null;
  role: string;
  addresses: TAddress[];
  primary_address: string | null;
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

  order_items: TOrderItem[];
};

type TOrderItem = {
  order_item_id: string;
  order_quantity: number;
  customer_id: string;
  product: TProduct;
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
  city: string;
  full_address: string;
  label: string;
  user_id: number;
  recipient_name: string;
  recipient_phone_number: string;
};
