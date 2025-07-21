"use client";

import PreviewProduct from "@/components/preview-product";
import { Label } from "@/components/ui/label";
import { trpc } from "@/hooks/trpc";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import  AdsProduct  from "@/components/ads-product"

export default function Page() {
  const { data: bajuCategory } = trpc.category.getBySlug.useQuery(
    "baju"
  );

  const { data: sepatuCategory } = trpc.category.getBySlug.useQuery(
    "sepatu"
  );

  const { data: topiCategory } = trpc.category.getBySlug.useQuery(
    "topi",
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AdsProduct />
      <br />
      <Label className="font-bold text-3xl">BAJU</Label>
      <ScrollArea className="w-full" >
        <div className="flex gap-4 w-max font-sans">
          <PreviewProduct products={bajuCategory?.products ?? []} />
        </div>
        <ScrollBar className="" orientation="horizontal" />
      </ScrollArea>

      <Label className="font-bold text-3xl">SEPATU</Label>
      <ScrollArea className="w-full" >
        <div className="flex gap-4 w-max font-sans">
          <PreviewProduct products={sepatuCategory?.products ?? []} />
        </div>
        <ScrollBar className="" orientation="horizontal" />
      </ScrollArea>

      <Label className="font-bold text-3xl">TOPI</Label>
      <ScrollArea className="w-full" >
        <div className="flex gap-4 w-max font-sans">
          <PreviewProduct products={topiCategory?.products ?? []} />
        </div>
        <ScrollBar className="" orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
