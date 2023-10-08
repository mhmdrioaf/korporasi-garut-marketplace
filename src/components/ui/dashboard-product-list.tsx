"use client";

import { TProduct } from "@/lib/globals";
import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import Image from "next/image";
import { Button } from "./button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useEffect, useState } from "react";
import ProductDelete from "./modals/product-delete";
import { useToast } from "./use-toast";

export type TDeleteResponse = {
  status: "success" | "destructive";
  message: string;
};

interface IDashboardProductListComponentProps {
  products: TProduct[];
}

export default function DashboardProductList({
  products,
}: IDashboardProductListComponentProps) {
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [deleteResponse, setDeleteResponse] = useState<TDeleteResponse | null>(
    null
  );

  const { toast } = useToast();

  const openDeleteModal = (product_id: string) => {
    setProductToDelete(product_id);
    setIsDelete(true);
  };

  const onModalCloses = () => {
    setIsDelete(false);
    setProductToDelete(null);
  };

  useEffect(() => {
    if (deleteResponse !== null) {
      toast({
        variant: deleteResponse.status,
        description: deleteResponse.message,
      });
    }
  }, [deleteResponse, toast]);

  return (
    <>
      <ProductDelete
        open={isDelete}
        product_id={productToDelete ?? ""}
        onClose={onModalCloses}
        setDeleteResponse={setDeleteResponse}
      />
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-1">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="font-bold text-2xl text-primary">Daftar Produk</p>
            <Link
              href={ROUTES.PRODUCT.ADD}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md flex flex-row gap-2 items-center justify-center"
            >
              <p>Tambahkan Produk</p>
            </Link>
          </div>
          <p className="text-sm">
            Berikut merupakan daftar produk yang telah anda tambahkan, dan telah
            di unggah pada halaman marketplace.
          </p>
        </div>
        {products.length > 0 &&
          products.map((product) => (
            <div
              key={product.id}
              className="w-full flex flex-row items-center justify-between gap-1 p-2 rounded-md border border-input"
            >
              <div className="w-48 h-auto aspect-square rounded-sm overflow-hidden relative">
                <Image
                  src={remoteImageSource(product.images[0])}
                  fill
                  alt={product.title}
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold">{product.title}</p>
                <p className="text-sm">
                  Stok tersedia: {product.stock} {product.unit}
                </p>
                <p className="text-sm">Total produk terjual: 30</p>
              </div>

              <p className="font-bold text-xl">
                {rupiahConverter(product.price)}
              </p>

              <div className="flex flex-col gap-2">
                <Link
                  href={ROUTES.PRODUCT.EDIT(product.id.toString())}
                  className="grid place-items-center bg-secondary text-secondary-foreground text-sm px-4 py-2 rounded-md"
                >
                  Edit produk
                </Link>
                <Link
                  href={ROUTES.PRODUCT.DETAIL(product.id.toString())}
                  className="grid place-items-center bg-primary text-primary-foreground text-sm px-4 py-2 rounded-md"
                >
                  Detail produk
                </Link>
                <Button
                  variant="destructive"
                  onClick={() => openDeleteModal(product.id.toString())}
                >
                  Hapus produk
                </Button>
              </div>
            </div>
          ))}

        {products.length < 1 && (
          <>
            <div className="w-full flex flex-col gap-2 justify-center items-center">
              <p>Saat ini anda belum mempunyai produk.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
