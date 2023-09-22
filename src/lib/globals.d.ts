import { StaticImageData } from "next/image";

type ICarouselAssets = {
  image: StaticImageData | string;
  title: string;
  descriptions: string | null;
};

type IProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  unit: string;
  weight: number;
  stock: number;
  variant: IProductVariant[];
};

type IProductVariant = {
  variant_id: string;
  variant_title: string;
  variant_value: string;
  variant_price: number;

  product_id: number;
  product: IProduct;
};

type IUser = {
  account: IAccount | null;
  user_id: number;
  username: string;
  email: string;
  phone_number: string | null;
  role: string;
  addresses: IAddress[];
  primary_address: string | null;
};

type IAccount = {
  account_id: string;
  user_id: number;
  user_name: string;
  profile_picture: string | null;
};

type ICustomerOrder = {
  order_id: string;
  order_status: ORDER_STATUS;
  order_date: Date;
  order_delivered_date: Date | null;
  customer_id: string;

  order_items: IOrderItem[];
};

type IOrderItem = {
  order_item_id: string;
  order_quantity: number;
  customer_id: string;
  product: IProduct;
};

type ORDER_STATUS =
  | "PENDING"
  | "PAID"
  | "PACKED"
  | "SHIPPED"
  | "DELIVERED"
  | "FINISHED";

type IAddress = {
  address_id: string;
  city: string;
  full_address: string;
  label: string;
  user_id: number;
  recipient_name: string;
  recipient_phone_number: string;
};
