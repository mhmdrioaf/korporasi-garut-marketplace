import { IProduct } from "@/lib/globals";
import ProductCard from "./product-card";

async function listProdudcts() {
  const fetchProducts = await fetch(
    process.env.NEXT_PUBLIC_API_LIST_PRODUCTS!,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const response = await fetchProducts.json();
  if (!response.ok) {
    return [];
  } else {
    return response.result as IProduct[];
  }
}

export default async function ProductsList() {
  const products = await listProdudcts();
  return (
    <div className="w-full grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 md:place-items-center overflow-auto">
      {products.map((product: IProduct) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
