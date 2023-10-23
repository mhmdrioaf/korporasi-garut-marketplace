"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { createImagePreview, remoteImageSource } from "@/lib/helper";
import { useContext, useRef } from "react";
import Image from "next/image";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { ProductContext } from "@/lib/hooks/context/useProductContext";
import { TProductContextType } from "@/lib/hooks/context/productContextType";

// TODO: Add product thumbnail input

export default function ProductImageAdd() {
  const {
    addImages,
    removeImage,
    productImages,
    currentImages,
    removeCurrentImage,
  } = useContext(ProductContext) as TProductContextType;

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const onImagesChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      addImages(files[0]);
    }
  };

  const onImageInputClicked = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    } else return;
  };

  const onImageDelete = (index: number) => {
    const imageToDelete = productImages[index];
    removeImage(imageToDelete);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const onCurrentImageDelete = (url: string) => {
    removeCurrentImage(url);
  };

  return (
    <div className="flex flex-col gap-2">
      <Label>Foto Produk</Label>
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
        {currentImages.length > 0 &&
          currentImages.map((source: string) => (
            <div
              key={source}
              className="w-full h-full aspect-square rounded-md overflow-hidden relative"
            >
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 z-30"
                onClick={() => onCurrentImageDelete(source)}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
              <Image
                src={remoteImageSource(source)}
                alt="foto produk"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        {productImages.length > 0 &&
          productImages.map((file, index) => (
            <div
              key={file.name}
              className="w-full h-full aspect-square rounded-md overflow-hidden relative"
            >
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 z-30"
                onClick={() => onImageDelete(index)}
              >
                <Trash2Icon className="w-4 h-4" />
              </Button>
              <Image
                src={createImagePreview(file)}
                alt={file.name}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}

        <div
          className="w-full h-full aspect-square grid place-items-center rounded-md border border-input cursor-pointer"
          onClick={() => onImageInputClicked()}
        >
          <PlusIcon className="w-4 h-4" />
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={onImagesChanges}
          ref={imageInputRef}
          className="hidden"
        />
      </div>
    </div>
  );
}
