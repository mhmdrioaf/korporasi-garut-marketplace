"use client";

import { Container } from "@/components/ui/container";
import ProductsList from "@/components/ui/products-list";
import { fetcher } from "@/lib/helper";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import Loading from "../loading";
import SearchBar from "@/components/ui/search-bar";
import { ROUTES } from "@/lib/constants";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { data, isLoading } = useSWR("/api/product/search/" + query, fetcher);

  if (isLoading) {
    return <Loading />;
  }

  if (data) {
    return (
      <Container variant="column">
        <div className="flex flex-row items-center gap-2">
          <Link
            href={ROUTES.LANDING_PAGE}
            className="px-4 py-2 rounded-sm text-xl text-primary font-bold"
          >
            <ArrowLeftIcon className="w-8 h-8" />
          </Link>
          <p className="text-2xl text-primary font-bold">Hasil Pencarian</p>
        </div>
        <SearchBar defaultQuery={query ?? ""} />
        {data.result.length < 1 ? (
          <div className="w-full grid place-items-center text-sm">
            Produk yang anda cari tidak ditemukan...
          </div>
        ) : (
          <ProductsList products={data.result} />
        )}
      </Container>
    );
  } else {
    return (
      <div className="w-full grid place-items-center text-sm">
        Produk yang anda cari tidak ditemukan...
      </div>
    );
  }
}
