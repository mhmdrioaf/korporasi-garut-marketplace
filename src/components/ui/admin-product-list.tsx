"use client";

import { ROUTES } from "@/lib/constants";
import { TProduct } from "@/lib/globals";
import { remoteImageSource, rupiahConverter } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { useEffect, useState } from "react";
import ProductStatusChangeModal from "./modals/product-status-change";
import { useToast } from "./use-toast";

interface IAdminProductListComponentProps {
  products: TProduct[];
  token: string;
}

export default function AdminProductList({
  products,
  token,
}: IAdminProductListComponentProps) {
  const [isStatusUpdate, setIsStatusUpdate] = useState<boolean>(false);
  const [productToUpdate, setProductToUpdate] = useState<string | null>(null);
  const [productStatusUpdateOption, setProductStatusUpdateOption] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);
  const [productStatusUpdateResponse, setProductStatusUpdateResponse] =
    useState<{
      status: "destructive" | "success";
      message: string;
    } | null>(null);

  const { toast } = useToast();

  const openProductStatusChangeModal = (
    options: "APPROVED" | "REJECTED",
    productId: string
  ) => {
    setIsStatusUpdate(true);
    setProductStatusUpdateOption(options);
    setProductToUpdate(productId);
  };

  const onModalCloses = () => {
    setIsStatusUpdate(false);
    setProductStatusUpdateOption(null);
    setProductToUpdate(null);
  };

  useEffect(() => {
    if (productStatusUpdateResponse !== null) {
      toast({
        variant: productStatusUpdateResponse.status,
        description: productStatusUpdateResponse.message,
      });
    }
  }, [productStatusUpdateResponse, toast]);

  return (
    <>
      <ProductStatusChangeModal
        onClose={onModalCloses}
        open={isStatusUpdate}
        options={productStatusUpdateOption ?? "APPROVED"}
        product_id={productToUpdate ?? ""}
        setStatusUpdateResponse={setProductStatusUpdateResponse}
        token={token}
      />
      <div className="w-full flex flex-col gap-4">
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
                  sizes="100vw"
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
                  href={ROUTES.ADMIN.PRODUCT_DETAIL(product.id.toString())}
                  className="grid place-items-center bg-secondary text-secondary-foreground text-sm px-4 py-2 rounded-md"
                >
                  Detail produk
                </Link>

                {product.status !== "APPROVED" && (
                  <Button
                    variant="default"
                    onClick={() =>
                      openProductStatusChangeModal(
                        "APPROVED",
                        product.id.toString()
                      )
                    }
                  >
                    Setujui Produk
                  </Button>
                )}

                {product.status !== "REJECTED" && (
                  <Button
                    variant="destructive"
                    onClick={() =>
                      openProductStatusChangeModal(
                        "REJECTED",
                        product.id.toString()
                      )
                    }
                  >
                    Tolak Produk
                  </Button>
                )}

                <p className="text-sm">
                  Status produk saat ini:{" "}
                  {product.status === "PENDING"
                    ? "Menunggu Persetujuan"
                    : "APPROVED"
                      ? "Disetujui"
                      : "Ditolak"}
                </p>
              </div>
            </div>
          ))}

        {products.length < 1 && (
          <>
            <div className="w-full flex flex-col gap-2 justify-center items-center">
              <p>Saat ini tidak ada produk dalam status ini.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
