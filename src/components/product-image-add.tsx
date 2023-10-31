"use client";

import { Input } from "./ui/input";
import { createImagePreview, remoteImageSource } from "@/lib/helper";
import { useRef } from "react";
import Image from "next/image";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { useProduct } from "@/lib/hooks/context/useProduct";

// TODO: Add product thumbnail input

export default function ProductImageAdd() {
  const { images, state } = useProduct();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const onImagesChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files.length > 0) {
      images.handler.add(files[0]);
    }
  };

  const onImageInputClicked = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    } else return;
  };

  const onImageDelete = (index: number) => {
    const imageToDelete = images.images[index];
    images.handler.remove(imageToDelete);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const onCurrentImageDelete = (url: string) => {
    images.handler.currentImageRemove(url);
  };

  return (
    <div className="flex flex-col gap-2">
      <p>Foto 1:1</p>
      <div className="flex flex-row items-center gap-2 flex-wrap">
        {images.current.length > 0 &&
          images.current.map((source: string) => (
            <div
              key={source}
              className="w-16 h-16 aspect-square rounded-md overflow-hidden relative shrink-0"
            >
              <Button
                variant="destructive"
                className="w-full h-full absolute top-0 right-0 z-30 opacity-5 hover:opacity-100 transition-opacity"
                onClick={() => onCurrentImageDelete(source)}
                type="button"
                disabled={state.uploading}
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
        {images.images.length > 0 &&
          images.images.map((file, index) => (
            <div
              key={file.name}
              className="w-16 h-16 aspect-square rounded-md overflow-hidden relative shrink-0"
            >
              <Button
                variant="destructive"
                className="w-full h-full absolute top-0 right-0 z-30 opacity-5 hover:opacity-100 transition-opacity"
                onClick={() => onImageDelete(index)}
                type="button"
                disabled={state.uploading}
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
          className="w-16 h-16 aspect-square grid place-items-center rounded-md border border-input cursor-pointer"
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
          disabled={state.uploading}
        />
      </div>
    </div>
  );
}
