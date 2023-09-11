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
