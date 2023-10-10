import { TProduct } from "@/lib/globals";
import ProductCard from "./product-card";

interface IProductListComponentProps {
  products: TProduct[];
}

export default async function ProductsList({
  products,
}: IProductListComponentProps) {
  if (products.length > 0) {
    return (
      <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 md:place-items-center overflow-auto">
        {products.map((product: TProduct) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    );
  } else {
    return (
      <div className="w-full grid place-items-center">
        <p className="text-sm">
          Untuk saat ini belum ada produk yang di unggah.
        </p>
      </div>
    );
  }
}
