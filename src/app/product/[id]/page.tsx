import Loading from "@/app/loading";
import { getProductDetail, getUserDetail } from "@/lib/api";
import authOptions from "@/lib/authOptions";
import { TUser } from "@/lib/globals";
import { DirectPurchaseProvider } from "@/lib/hooks/context/useDirectPurchase";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Suspense, lazy } from "react";

const ProductDetail = lazy(() => import("@/components/ui/product-detail"));

interface IProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = await getProductDetail(params.id);
  if (product) {
    return {
      title: `${product.title} | SMKs Korporasi Garut`,
      description: product.description,
      category: product.category?.category_name,
      keywords: product.tags?.join(", "),
      authors: [{ name: product.seller.account.user_name }],
    };
  } else {
    return {
      title: "Produk tidak ditemukan | SMKs Korporasi Garut",
      description: "Produk tidak ditemukan",
    };
  }
}

export default async function ProductDetailPage({
  params,
}: IProductDetailPageProps) {
  const productData = getProductDetail(params.id);
  const sessionData = getServerSession(authOptions);
  let user: TUser | null = null;

  const [product, session] = await Promise.all([productData, sessionData]);

  if (session) {
    user = await getUserDetail(session.user.id);
  }

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
        <DirectPurchaseProvider product={product} user={user}>
          <ProductDetail />
        </DirectPurchaseProvider>
      </Suspense>
    );
}
