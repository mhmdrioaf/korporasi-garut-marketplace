import Carousel from "@/components/ui/carousel";
import { Container } from "@/components/ui/container";
import { CarouselAssets } from "@/lib/constants";

export default function Home() {
  return (
    <Container variant="column">
      <Carousel className="h-96" assets={CarouselAssets} />
      {/* TODO: Add carousel */}
      {/* TODO: Add products catalogue */}
      {/* TODO: Add sidebar containing product categories */}

      <p>Hello home page</p>
    </Container>
  );
}
