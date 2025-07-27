"use client";

import { useState, useEffect } from "react";
import { trpc } from "@/hooks/trpc";
import { Search } from "lucide-react";
import Link from "next/link";
import { SearchForm } from "./search-form";

export function AutocompleteProduct() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data: results } = trpc.product.getByName.useQuery(
    { q: query },
    { enabled: query.length > 0 }
  );

  useEffect(() => {
    if (query.length === 0) setOpen(false);
    else setOpen(true);
  }, [query]);

  return (
    <div className="relative w-full">
      <div className="relative">
        
        <SearchForm
        className="sm:w-[40%] md:w-[40%] lg:w-[20%]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {open && results && (
        <div className="absolute z-100 bg-white border w-full mt-1 rounded shadow">
          {results.length === 0 && (
            <div className="p-2 text-sm text-gray-500">No product found</div>
          )}
          {results.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
            >
              {product.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
