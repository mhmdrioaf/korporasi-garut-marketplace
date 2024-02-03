"use client";

import { TProduct } from "@/lib/globals";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { useEffect, useState } from "react";
import ProductDelete from "./modals/product-delete";
import { useToast } from "./use-toast";
import SellerProductCard from "./seller-product-card";
import ProductDetailModal from "./product-detail-modal";
import { PlusIcon } from "lucide-react";

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
  const [productDetail, setProductDetail] = useState<{
    product: TProduct | null;
    open: boolean;
  }>({ product: null, open: false });
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

  const onProductDetailOpen = (product: TProduct) => {
    setProductDetail({
      product: product,
      open: true,
    });
  };

  const onProductDetailCloses = () => {
    setProductDetail({
      product: null,
      open: false,
    });
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
      {productDetail.product && productDetail.open && (
        <ProductDetailModal
          product={productDetail.product}
          open={productDetail.open}
          onClose={onProductDetailCloses}
        />
      )}
      <ProductDelete
        open={isDelete}
        product_id={productToDelete ?? ""}
        onClose={onModalCloses}
        setDeleteResponse={setDeleteResponse}
      />
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-col gap-1">
          <div className="w-full flex flex-row items-center justify-between">
            <p className="font-bold text-base md:text-2xl text-primary">
              Daftar Produk
            </p>
            <Link
              href={ROUTES.PRODUCT.ADD}
              className="px-2 md:px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md flex flex-row gap-2 items-center justify-center"
            >
              <p className="hidden md:block">Tambahkan Produk</p>
              <PlusIcon className="w-4 h-4 block md:hidden" />
            </Link>
          </div>
          <p className="text-xs md:text-sm">
            Berikut merupakan daftar produk yang telah anda tambahkan, dan telah
            di unggah pada halaman marketplace.
          </p>
        </div>

        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2 lg:gap-4 mb-12 md:mb-8 lg:mb-0">
          {products.length > 0 &&
            products.map((product) => (
              <SellerProductCard
                key={product.id}
                product={product}
                onDelete={openDeleteModal}
                onProductDetail={onProductDetailOpen}
              />
            ))}
        </div>

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
