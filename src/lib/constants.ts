import csl1 from "/public/csl-1.jpg";
import csl2 from "/public/csl-2.jpg";
import csl3 from "/public/csl-3.jpg";

import {
  TAddress,
  TCarouselAssets,
  TCustomerOrder,
  TOrderItem,
  TProduct,
} from "./globals";

export const CarouselAssets: TCarouselAssets[] = [
  {
    title: "SMKS Korporasi Garut",
    image: csl1,
    descriptions: "JL. Dalem Kasep No. 7, Bluburlimbangan, Garut",
  },
  {
    title: "Hortikultura",
    image: csl2,
    descriptions: "Menghasilkan Produk Terbaik",
  },
  {
    title: "Florikultura",
    image: csl3,
    descriptions: "Lingkungan Pengembangan Natural",
  },
];

export const ProductsAssets: TProduct[] = [
  {
    id: 1,
    title: "Bunga Mawar",
    descriptions:
      "Bunga ini merupakan bunga yang ditumbuhkembangkan dalam lingkungan yang sangat sehat.",
    images: ["/csl-1.jpg"],
    price: 10000,
    seller_id: 3,
  },
  {
    id: 2,
    title: "Keripik Kentang",
    descriptions:
      "Keripik ini dibuat dari kentang asli, yang di tanam di lingkungan yang sangat sehat.",
    images: ["/csl-2.jpg"],
    price: 15000,
    seller_id: 3,
  },
  {
    id: 3,
    title: "Keripik Apel",
    descriptions:
      "Keripik ini mempunyai bahan utama apel merah, yang di tanam dalam lingkungan yang sangat steril.",
    images: ["/csl-2.jpg"],
    price: 5000,
    seller_id: 3,
  },
  {
    id: 4,
    title: "Bunga Mawar",
    descriptions:
      "Bunga ini merupakan bunga yang ditumbuhkembangkan dalam lingkungan yang sangat sehat.",
    images: ["/csl-1.jpg"],
    price: 10000,
    seller_id: 3,
  },
  {
    id: 5,
    title: "Keripik Kentang",
    descriptions:
      "Keripik ini dibuat dari kentang asli, yang di tanam di lingkungan yang sangat sehat.",
    images: ["/csl-2.jpg"],
    price: 15000,
    seller_id: 3,
  },
  {
    id: 6,
    title: "Keripik Apel",
    descriptions:
      "Keripik ini mempunyai bahan utama apel merah, yang di tanam dalam lingkungan yang sangat steril.",
    images: ["/csl-2.jpg"],
    price: 5000,
    seller_id: 3,
  },
  {
    id: 7,
    title: "Keripik Apel",
    descriptions:
      "Keripik ini mempunyai bahan utama apel merah, yang di tanam dalam lingkungan yang sangat steril.",
    images: ["/csl-2.jpg"],
    price: 5000,
    seller_id: 3,
  },
  {
    id: 8,
    title: "Keripik Apel",
    descriptions:
      "Keripik ini mempunyai bahan utama apel merah, yang di tanam dalam lingkungan yang sangat steril.",
    images: ["/csl-2.jpg"],
    price: 5000,
    seller_id: 3,
  },
];

export const IMAGE_UPLOAD_NOTES =
  "Perlu di ingat bahwa mengunggah gambar dapat memakan waktu hingga paling lama 5 menit untuk menerapkan perubahan pada semua platform. Untuk itu, ketika anda telah menunggah foto profil baru, namun foto profil belum berubah, harap login kembali ke akun anda untuk melihat perubahannya.";

export const ACCOUNT_DELETE_NOTES =
  "Perlu di ingat bahwa aksi ini tidak bisa di batalkan, ketika anda menghapus akun anda, akun tersebut selamanya terhapus dan tidak bisa di kembalikan. Harap muat ulang halaman ketika anda telah menghapus akun anda.";

const ORDERS_ITEM: TOrderItem = {
  customer_id: "1",
  order_item_id: "IORD1001",
  order_quantity: 2,
  product: ProductsAssets[0],
};

export const CUSTOMER_ORDERS: TCustomerOrder[] = [
  {
    customer_id: "1",
    order_date: new Date(),
    order_id: "ORD1001",
    order_status: "PENDING",
    order_delivered_date: null,
    order_items: [ORDERS_ITEM],
  },
];

export const ROUTES = {
  LANDING_PAGE: "/",
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
  },
  USER: {
    DASHBOARD: "/user/dashboard",
    ORDERS: "/user/dashboard/orders",
    ADDRESSES: "/user/dashboard/address",
    ADD_ADDRESS: "/user/dashboard/address/create",
  },
  PRODUCT: {
    DETAIL: (id: string) => `/product/${id}`,
  },
};
