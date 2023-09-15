import Loading from "@/app/loading";
import { getProductDetail } from "@/lib/helper";
import { Suspense, lazy } from "react";

const ProductDetail = lazy(() => import("@/components/ui/product-detail"));

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = getProductDetail(params.id);
  return (
    <Suspense fallback={<Loading />}>
      <ProductDetail product={product!} />
    </Suspense>
  );
}
