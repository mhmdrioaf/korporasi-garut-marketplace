import { StaticImageData } from "next/image";

type ICarouselAssets = {
  image: StaticImageData | string;
  title: string;
  descriptions: string | null;
};

type IProduct = {
  id: number;
  title: string;
  descriptions: string;
  price: number;
  seller_id: number;
  images: string[];
};

type IUser = {
  account: IAccount | null;
  user_id: number;
  username: string;
  email: string;
  phone_number: string | null;
  role: string;
};

type IAccount = {
  account_id: string;
  user_id: number;
  user_name: string;
  profile_picture: string | null;
  addresses: IAddress[];
  primary_address: string | null;
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
  address_label: AddressLabel;
  user_id: number;
};

type AddressLabel = "HOME" | "OFFICE";
