"use client";

import { ICarouselAssets } from "@/lib/globals";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { HTMLAttributes, useCallback, useEffect, useState } from "react";

interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  assets: ICarouselAssets[];
  autoplay?: boolean;
  duration?: number;
}

export default function Carousel({
  assets,
  autoplay = true,
  duration = 3000,
  className,
}: CarouselProps) {
  const [activeImage, setActiveImage] = useState<number>(0);

  const handleNextPicture = useCallback(() => {
    setActiveImage(activeImage === assets.length - 1 ? 0 : activeImage + 1);
  }, [activeImage, assets.length]);

  const handlePrevPicture = useCallback(() => {
    setActiveImage(activeImage === 0 ? assets.length - 1 : activeImage - 1);
  }, [activeImage, assets.length]);

  useEffect(() => {
    if (autoplay) {
      const handleNext = () => {
        handleNextPicture();
      };

      const interval = setInterval(handleNext, duration);

      return () => clearInterval(interval);
    }
  }, [autoplay, handleNextPicture, duration]);

  const carouselContainerStyles = `w-full rounded-lg overflow-hidden flex flex-col gap-4 items-center justify-center p-16 lg:p-8 relative ${className}`;

  return (
    <div className={carouselContainerStyles}>
      <Image
        src={assets[activeImage].image}
        alt={assets[activeImage].title}
        fill
        className="object-cover"
        sizes="100vw"
      />

      <div className="w-full h-full bg-gradient-to-t bg-opacity-60 from-stone-950 to-transparent absolute top-0 left-0" />

      <div className="w-full h-full text-white absolute top-0 left-0 flex flex-col items-center justify-center">
        <p className="text-xl lg:text-5xl font-bold">
          {assets[activeImage].title}
        </p>
        <p className="text-sm lg:text-base">
          {assets[activeImage].descriptions}
        </p>
      </div>

      <div className="w-full h-full absolute top-0 left-0 flex flex-row justify-between items-center">
        <div
          className="h-full p-8 grid place-items-center cursor-pointer text-white"
          onClick={handlePrevPicture}
        >
          <ChevronLeft className="w-8 h-8" />
        </div>

        <div
          className="h-full p-8 grid place-items-center cursor-pointer text-white"
          onClick={handleNextPicture}
        >
          <ChevronRight className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
}
