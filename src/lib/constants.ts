import csl1 from "/public/csl-1.jpg";
import csl2 from "/public/csl-2.jpg";
import csl3 from "/public/csl-3.jpg";

import { ICarouselAssets, IProduct } from "./globals";

export const CarouselAssets: ICarouselAssets[] = [
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

export const ProductsAssets: IProduct[] = [
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
