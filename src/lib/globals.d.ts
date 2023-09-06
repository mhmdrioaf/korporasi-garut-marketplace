import { StaticImageData } from "next/image";

type ICarouselAssets = {
  image: StaticImageData | string;
  title: string;
  descriptions: string | null;
};
