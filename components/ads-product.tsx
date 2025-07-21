"use client";

import { trpc } from "@/hooks/trpc";
import {
    Card,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdsProduct() {
    const { data: products } = trpc.product.getAll.useQuery();
    const router = useRouter();
    const [index, setIndex] = useState(0);

    if (!products || products.length === 0) {
        return <div>No products available</div>;
    }

    const current = products[index];

    const handlePrev = () => {
        setIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    const handleShopNow = () => {
        router.push(`/product/${current.id}`);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <Card className="w-full  p-10 flex flex-row justify-between items-center gap-4 rounded-none border-none shadow-none">
                <div className="flex flex-col gap-6 ">
                    <Card className="rounded-none p-4">
                        <CardTitle className="text-center">{current.name}</CardTitle>
                        <CardDescription className="text-center">
                            {current.description}
                        </CardDescription>
                        <p className="font-sans font-medium ">Stock : {current.stock}</p>
                    </Card>
                    <Card className="rounded-none flex flex-row gap-2 w-auto p-4 justify-around items-center">
                        <p className="text-md font-bold">Rp {current.price.toLocaleString("id-ID")}</p>
                        <Button size="" className="w-[40%] " onClick={handleShopNow} variant="vancy">
                            Shop Now
                        </Button>
                    </Card>
                </div>
                    <Card className="rounded-none relative min-w-[25%] aspect-square">
                        <Image
                            src={current.image || "/placeholder.jpg"}
                            alt={current.name}
                            fill
                            className="object-cover rounded"
                        />
                    </Card>
            </Card>
            <div className="flex gap-4 mt-4">
                <Button className="" size="" onClick={handlePrev} variant="outline">
                    Prev
                </Button>
                <Button size="" className="" onClick={handleNext} variant="outline">
                    Next
                </Button>
            </div>
        </div>
    );
}
