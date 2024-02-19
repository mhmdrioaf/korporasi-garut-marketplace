type TUser = {
  user_id: number;
  username: string;
  email: string;
  phone_number: string | null;
  role: ROLE;
  createdAt: Date;
  primary_address_id: string | null;
  token: string;
  is_disabled: boolean;

  account: TAccount;
  address: TAddress[];
  notifications: TNotification | null;
  carts: TCustomerCart | null;
  orders: TOrder[];
};

type TCustomer = TUser;

type TAccount = {
  account_id: string;
  user_name: string;
  profile_picture: string | null;
};

type TSeller = Omit<TUser, "role" | "createdAt" | "token" | "is_disabled"> & {
  product: TProduct[];
};

type TSellerProfile = Pick<
  TUser,
  "account" | "address" | "primary_address_id" | "email"
> & {
  products: Partial<TProduct>[];
};

type TNotification = {
  notification_id: string;
  subscriber_id: number;

  items: TNotificationItem[];
};

type TNotificationItem = {
  notification_item_id: string;
  title: string;
  description: string | null;
  redirect_url: string | null;
  show_action_button: boolean;
  notifiedAt: Date;
  status: NOTIFICATION_STATUS;

  notification_id: string;
};

type TCustomerCart = {
  cart_id: string;
  total_price: number;
  total_weight: number;

  cart_items: TCustomerCartItem[];
};

type TCustomerCartItem = {
  cart_item_id: string;
  product_id: number;
  quantity: number;
  product_variant_item_id: string | null;

  product: TProduct;
  variant: TProductVariantItem | null;
  cart_id: string;
};

type TCustomerCartGroupedBySeller = {
  seller: TUser;
  products: TCustomerCartItem[];
};

type ROLE = "ADMIN" | "SELLER" | "CUSTOMER";
type NOTIFICATION_STATUS = "READ" | "UNREAD";
