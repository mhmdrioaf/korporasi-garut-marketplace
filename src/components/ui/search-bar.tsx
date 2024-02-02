"use client";

import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";
import { SearchIcon } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [isKeyReleased, setIsKeyReleased] = useState<boolean>(false);
  const router = useRouter();

  const onQueryChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length) {
      setQuery(value);
    } else {
      setQuery("");
    }
  };

  const onInputKeyDownHandler = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { key } = event;
    if (key === "Enter" && query.length) {
      router.push("/search?q=" + query);
    }

    if (key === "Backspace" && query.length < 1 && isKeyReleased) {
      router.push(ROUTES.LANDING_PAGE);
    }

    setIsKeyReleased(false);
  };

  const onInputKeyUpHandler = () => {
    setIsKeyReleased(true);
  };

  const onSearchProductHandler = () => {
    router.push("/search?q=" + query);
  };

  return (
    <div className="hidden w-full rounded-md overflow-hidden border border-input md:flex flex-row items-center justify-between relative">
      <input
        className="ml-4 w-full outline-none text-sm"
        type="text"
        value={query}
        onChange={onQueryChangeHandler}
        onKeyDown={onInputKeyDownHandler}
        onKeyUp={onInputKeyUpHandler}
        placeholder="Cari produk, kategori, kata kunci, penjual, dll"
      />
      <Button
        variant={query.length ? "default" : "ghost"}
        onClick={() => onSearchProductHandler()}
        disabled={query.length < 1}
      >
        <SearchIcon className="w-4 h-4 mr-2" />
        <span>Cari</span>
      </Button>
    </div>
  );
}
