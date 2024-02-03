import AdminProductDetailComponent from "@/components/ui/admin-product-detail";
import { getProductDetail } from "@/lib/api";

export default async function AdminProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id;
  const product = await getProductDetail(productId);

  if (!product) {
    return (
      <div className="w-full grid place-items-center">
        Produk ini tidak ditemukan.
      </div>
    );
  } else {
    return <AdminProductDetailComponent product={product} />;
  }
}
