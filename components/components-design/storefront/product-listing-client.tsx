"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/components-design/storefront/product-grid";
import type { ProductListParams } from "@/features/storefront/api/products.api";

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "title:asc", label: "Name: A–Z" },
  { value: "title:desc", label: "Name: Z–A" },
  { value: "createdAt:asc", label: "Oldest" },
] as const;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function ProductListingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const debouncedSearch = useDebounce(searchInput, 400);

  const sort = searchParams.get("sort") ?? "createdAt:desc";
  const category = searchParams.get("category") ?? "";
  const page = Number(searchParams.get("page") ?? "1");

  const updateParam = useCallback(
    (key: string, value: string) => {
      const current = searchParams.get(key) ?? "";
      if (current === value) return;
      const next = new URLSearchParams(searchParams.toString());
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      if (key !== "page") next.set("page", "1");
      router.push(`?${next.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const isMounted = React.useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    updateParam("q", debouncedSearch);
  }, [debouncedSearch, updateParam]);

  const [sortBy, sortOrder] = sort.split(":") as [string, "asc" | "desc"];

  const gridParams: ProductListParams = {
    search: searchParams.get("q") ?? undefined,
    sortBy: sortBy as ProductListParams["sortBy"],
    sortOrder: sortOrder as ProductListParams["sortOrder"],
    categoryId: category || undefined,
    page,
    limit: 24,
    status: "ACTIVE",
  };

  const activeFiltersCount = [category].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Search + Sort + Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
          {searchInput && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchInput("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <Select
          value={sort}
          onValueChange={(v) => updateParam("sort", v)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-[10px]">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category-filter">Category</Label>
                <Input
                  id="category-filter"
                  placeholder="e.g. shirts, shoes..."
                  value={category}
                  onChange={(e) => updateParam("category", e.target.value)}
                />
              </div>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const next = new URLSearchParams();
                    if (searchParams.get("q")) next.set("q", searchParams.get("q")!);
                    if (searchParams.get("sort")) next.set("sort", searchParams.get("sort")!);
                    router.push(`?${next.toString()}`, { scroll: false });
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filter chips */}
      {(searchParams.get("q") || category) && (
        <div className="flex flex-wrap gap-2">
          {searchParams.get("q") && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchParams.get("q")}
              <button onClick={() => { setSearchInput(""); updateParam("q", ""); }} aria-label="Remove search filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="gap-1">
              Category: {category}
              <button onClick={() => updateParam("category", "")} aria-label="Remove category filter">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Product grid */}
      <ProductGrid params={gridParams} />
    </div>
  );
}
