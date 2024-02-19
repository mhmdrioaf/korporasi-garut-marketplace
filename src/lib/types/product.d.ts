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
  tags: string[];
  status: PRODUCT_STATUS;
  sold_count: number;
  visitor: number;
  cart_count: number;
  search_count: number;

  seller_id: number;
  category_id: string | null;

  seller: TSeller;
  variant: TProductVariant | null;
  category: TProductCategory | null;
};

type TProductVariant = {
  variant_id: string;
  variant_title: string;

  variant_item: TProductVariantItem[];
};

type TProductVariantItem = {
  variant_item_id: string;
  variant_name: string;
  variant_stock: number;
  variant_price: number;
  pending_order_count: number; // TODO: check if this is needed
};

// TODO: Remove this type(s) below
type TProductCategory = {
  category_id: string;
  category_name: string;
};

type PRODUCT_STATUS = "APPROVED" | "PENDING" | "REJECTED";
