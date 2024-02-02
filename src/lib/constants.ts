import { TCarouselAssets } from "./globals";

export const CarouselAssets: TCarouselAssets[] = [
  {
    title: "SMKS Korporasi Garut",
    image: "/csl-1.jpg",
    descriptions: "JL. Dalem Kasep No. 7, Bluburlimbangan, Garut",
  },
  {
    title: "Hortikultura",
    image: "/csl-2.jpg",
    descriptions: "Menghasilkan Produk Terbaik",
  },
  {
    title: "Florikultura",
    image: "/csl-3.jpg",
    descriptions: "Lingkungan Pengembangan Natural",
  },
];

export const IMAGE_UPLOAD_NOTES =
  "Perlu di ingat bahwa mengunggah gambar dapat memakan waktu hingga paling lama 5 menit untuk menerapkan perubahan pada semua platform. Untuk itu, ketika anda telah menunggah foto profil baru, namun foto profil belum berubah, harap login kembali ke akun anda untuk melihat perubahannya.";

export const ACCOUNT_DELETE_NOTES =
  "Perlu di ingat bahwa aksi ini tidak bisa di batalkan, ketika anda menghapus akun anda, akun tersebut selamanya terhapus dan tidak bisa di kembalikan. Harap muat ulang halaman ketika anda telah menghapus akun anda.";

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
    PRODUCTS_LIST: "/user/dashboard/product-list",
    CART: "/user/cart",
    ORDERS_MANAGEMENT: "/user/dashboard/seller-orders",
    STORE_PROFILE: (sellerID: string) => "/store/" + sellerID,
    PAYMENT_PROOF: (invoiceID: string) =>
      "/user/dashboard/payment/" + invoiceID,
  },
  PRODUCT: {
    DETAIL: (id: string) => `/product/${id}`,
    ADD: "/product/add",
    EDIT: (id: string) => `/product/edit/${id}`,
  },
  ADMIN: {
    DASHBOARD: "/admin",
    USER_MANAGEMENT: {
      MAIN: "/admin/user-management",
      USERS: "/admin/user-management/users",
      SELLERS: "/admin/user-management/sellers",
      ADD_SELLER: "/admin/seller-add",
    },
    PRODUCT_MANAGEMENT: {
      MAIN: "/admin/product-management",
      PENDING: "/admin/product-management/pending",
      APPROVED: "/admin/product-management/approved",
      REJECTED: "/admin/product-management/rejected",
    },
    PRODUCT_DETAIL: (id: string) => `/admin/product/${id}`,
    REPORTS: "/admin/reports",
  },
};

export const CATEGORIES_OPTIONS = (CATEGORY_ID: string) =>
  !CATEGORY_ID ? "UNCATEGORIZED" : CATEGORY_ID;
