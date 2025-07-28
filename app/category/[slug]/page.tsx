"use client";

import PreviewProduct from "@/components/preview-product";
import { Label } from "@/components/ui/label";
import { trpc } from "@/hooks/trpc";
import { useParams } from "next/navigation";
type RouteParams = {
    slug: string;
};

const ads = {
    name: [
        {
            title: "Exclusive Offers",
            description: "30% off on select items"
        },
        {
            title: "New Arrivals",
            description: "10+ new Arrivals Daily"
        },
        {
            title: "Over 50+ products",
            description: "curated fashion products"
        },

    ]
}

export default function Page() {
    const params = useParams<RouteParams>();
    const slug = params.slug;


    const { data: product } = trpc.category.getBySlug.useQuery(
        slug
    );

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 items-center">
            <div className="flex md:flex-col flex-col lg:flex-row lg:justify-between md:gap-3 gap-2 items-center w-[90%] h-1/4">
                <div className="flex flex-col gap-4 sm:w-[90%] md:w-[90%] lg:w-[40%] h-full">
                    <p className="font-bold font-sans text-2xl">DISCOVER NOW</p>
                    <p className="font-semibold text-sm text-gray-400 font-sans">Dive into the world of fashion excellence at Klothink. Our curated selection brings together the latest trends and timeless classics, offering you a diverse array of clothing items that resonate with your unique style.</p>
                </div>
                {ads.name.map((ad) => (
                    <div key={ad.title} className="sm:w-[90%] md:w-[90%] lg:w-[19%] flex flex-col gap-4 m1 border rounded-lg p-6">
                        <p className="font-bold text-lg">{ad.title}</p>
                        <p className="text-sm text-gray-400 font-mono">{ad.description}</p>
                    </div>
                ))}
            </div>
            <Label className="font-bold text-3xl">{product?.name}</Label>

            <div className="flex gap-4 w-max font-sans">
                <PreviewProduct variant="gidr" className="grid sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 w-full" products={product?.products ?? []} />
            </div>


        </div>
    );
}
