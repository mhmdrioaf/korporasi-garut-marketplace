import { ProductsAssets } from "@/lib/constants";
import { IProduct } from "@/lib/globals";
import ProductCard from "./product-card";

export default function ProductsList() {
  return (
    <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 md:place-items-center overflow-auto">
      {ProductsAssets.map((product: IProduct) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
