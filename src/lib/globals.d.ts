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
};

type ICustomerOrder = {
  order_id: string;
  order_status:
    | "PENDING"
    | "PAID"
    | "PACKED"
    | "SHIPPED"
    | "DELIVERED"
    | "FINISHED";
  order_date: Date;
  order_total_amount: number;
  customer_id: string;
  order_items_id: string[];

  products: IProduct[];
};
