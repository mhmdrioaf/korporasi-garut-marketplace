import csl1 from "/public/csl-1.jpg";
import csl2 from "/public/csl-2.jpg";
import csl3 from "/public/csl-3.jpg";

import { TCarouselAssets } from "./globals";

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
  },
  PRODUCT: {
    DETAIL: (id: string) => `/product/${id}`,
  },
};
