import Carousel from "@/components/ui/carousel";
import { Container } from "@/components/ui/container";
import ProductsList from "@/components/ui/products-list";
import { CarouselAssets } from "@/lib/constants";
import { TProduct } from "@/lib/globals";

async function listProducts() {
  const fetchProducts = await fetch(process.env.NEXT_PUBLIC_API_PRODUCT_LIST!, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  const response = await fetchProducts.json();
  if (!response.ok) {
    return [];
  } else {
    return response.result.products as TProduct[];
  }
}

export default async function Home() {
  const products = await listProducts();
  return (
    <Container variant="column">
      <Carousel className="h-96" assets={CarouselAssets} />
      <ProductsList
        products={products.filter((product) => product.status === "APPROVED")}
      />
      {/* TODO: Add sidebar containing product categories */}
    </Container>
  );
}
