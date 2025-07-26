"use client";

import PreviewProduct from "@/components/preview-product";
import { Label } from "@/components/ui/label";
import { trpc } from "@/hooks/trpc";
import { useParams } from "next/navigation";
type RouteParams = {
  slug: string;
};

export default function Page() {
    const params = useParams<RouteParams>();
    const slug = params.slug;


    const { data: product } = trpc.category.getBySlug.useQuery(
        slug
    );

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 items-center">
            <Label className="font-bold text-3xl">{product?.name}</Label>

            <div className="flex gap-4 w-max font-sans">
                <PreviewProduct variant="gidr" products={product?.products ?? []} />
            </div>


        </div>
    );
}
