
"use client";

import dynamic from "next/dynamic";
import PreviewProduct from "@/components/preview-product";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useState } from "react";

import { trpc } from "@/hooks/trpc";

const AddProductForm = dynamic(() => import("@/components/add-product-form"), {
  ssr: false,
});
const AddDiscount = dynamic(() => import("@/components/add-discount"), {
  ssr: false,
});

export default function AdminProductPage() {
  const { data: products } = trpc.product.getAll.useQuery();
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <div className="p-4">
      <div className="flex gap-2 item-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Halaman Tambah Produk</h1>
        <Link
          href="/"
          className="text-[18px] font-sans font-md hover:underline "
        >
          Dashboard
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-2 items-start">
        <div className=" w-full flex flex-col lg:flex-row gap-2 items-start">

          <AddProductForm
            productToEdit={selectedProduct}
            clearEdit={() => setSelectedProduct(null)}
          />
          <ScrollArea className="w-full max-h-[800px] overflow-y-auto p-2 rounded-sm border">
            <div className="w-full">
              <PreviewProduct variant="gidr" onEdit={setSelectedProduct} products={products} />
            </div>

          </ScrollArea>
        </div>
        <AddDiscount />

      </div>
    </div>
  );
}
