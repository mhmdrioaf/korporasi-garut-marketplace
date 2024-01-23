"use client";

import { ROUTES } from "@/lib/constants";
import { TProduct } from "@/lib/globals";
import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

interface ISellerProductCardComponentProps {
  product: TProduct;
  onDelete: (product_id: string) => void;
  onProductDetail: (product: TProduct) => void;
}

export default function SellerProductCard({
  product,
  onDelete,
  onProductDetail,
}: ISellerProductCardComponentProps) {
  return (
    <div className="w-full p-2 flex flex-col gap-2 rounded-md border border-input relative select-none">
      <div className="w-full h-auto aspect-square rounded-sm overflow-hidden relative">
        <Image
          src={remoteImageSource(product.images[0])}
          fill
          alt={product.title}
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <p title={product.title} className="text-lg font-bold truncate">
        {product.title}
      </p>

      <div className="absolute top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="p-1 rounded-md bg-background bg-opacity-30 backdrop-blur-sm">
              <MoreVerticalIcon className="w-4 h-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Button
                asChild
                variant="outline"
                type="button"
                className="w-full"
              >
                <Link href={ROUTES.PRODUCT.EDIT(product.id.toString())}>
                  Edit Produk
                </Link>
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Button
                variant="default"
                type="button"
                className="w-full"
                onClick={() => onProductDetail(product)}
              >
                Detail Produk
              </Button>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Button
                variant="destructive"
                type="button"
                onClick={() => onDelete(product.id.toString())}
                className="w-full"
              >
                Hapus Produk
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="w-full flex flex-row items-center justify-between">
        <p className="text-sm font-bold">{rupiahConverter(product.price)}</p>
        <p className="text-xs">
          Stok: {product.stock} {product.unit}
        </p>
      </div>

      <Button className="w-full" variant="default" asChild>
        <Link href={ROUTES.PRODUCT.DETAIL(product.id.toString())}>
          Lihat Produk
        </Link>
      </Button>
    </div>
  );
}