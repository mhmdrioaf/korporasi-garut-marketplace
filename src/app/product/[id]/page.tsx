import Loading from "@/app/loading";
import { getProductDetail } from "@/lib/helper";
import { Suspense, lazy } from "react";

const ProductDetail = lazy(() => import("@/components/ui/product-detail"));

interface IProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({
  params,
}: IProductDetailPageProps) {
  const product = await getProductDetail(params.id);
  if (!product)
    return (
      <div className="w-full h-screen grid place-items-center">
        <p className="text-2xl text-primary font-bold">Ups.</p>
        <p className="text-sm">Produk ini tidak tersedia.</p>
      </div>
    );
  else
    return (
      <Suspense fallback={<Loading />}>
        <ProductDetail product={product} />
      </Suspense>
    );
}
