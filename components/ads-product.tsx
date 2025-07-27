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
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "./ui/loading";
import DiscountSlider from "./ui/discount";

export default function AdsProduct() {
    const { data: products, isLoading } = trpc.product.getAll.useQuery();
    const { data: discount } = trpc.discount.getAll.useQuery();
    const router = useRouter();
    const [index, setIndex] = useState(0);


    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <LoadingPage />
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <p className="text-gray-500 font-sans">No products found.</p>
            </div>
        );
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
        <div className="flex flex-col items-center justify-center lg:p-4">
            <Card className="sm:w-[95%] md:w-[90%] lg:w-full  h-1/3 md:p-2 lg:p-10 flex sm:flex-col-reverse md:flex-col-reverse lg:flex-row justify-between items-center gap-4 rounded-none border-none shadow-none relative">
                <div className="sm:w-full md:w-full lg:w-1/2 h-1/2 flex flex-col gap-4 ">
                    <Card className="h-1/3 w-full  font-sans p-4 border-none shadow-none bg-gray-100">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={index}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.5 }}
                                className=""
                            >
                                <CardTitle className="text-start h-2/3 w-full font-bold text-3xl ">{current.name}</CardTitle>
                                <CardDescription className="w-full h-1/3 text-start text-sm text-gray-400">
                                    {current.description}
                                </CardDescription>
                            </motion.h2>
                        </AnimatePresence>
                        <p className="font-sans font-medium ">Stock : {current.stock}</p>
                        <Card className=" w-full h-1/2 flex flex-row gap-2  p-4 justify-around items-center">
                            <p className="text-md font-bold">Rp {current.price.toLocaleString("id-ID")}</p>
                            <Button size="" className="w-[40%] " onClick={handleShopNow} variant="vancy">
                                Shop Now
                            </Button>
                        </Card>
                    </Card>
                    <div className=" w-full h-1/2 p-1 gap-2 grid grid-cols-2 ">
                        <Card className="w-full   h-fit flex flex-col items-center  gap-2 rounded-none">
                            <CardTitle className="font-bold text-3xl font-mono">24/7</CardTitle>
                            <CardDescription className='font-mono text-gray-400 text-sm'>Shoping Convinience</CardDescription>
                        </Card>
                        <Card className="w-full   h-fit flex flex-col items-center  gap-2 rounded-none">
                            <CardTitle className="font-bold text-3xl font-mono">OVER 1000+</CardTitle>
                            <CardDescription className='font-mono text-gray-400 text-sm'>Trendsetting Styles</CardDescription>
                        </Card>
                        <Card className="w-full   h-fit flex flex-col items-center  gap-2 rounded-none">
                            <CardTitle className="font-bold text-3xl font-mono">99%</CardTitle>
                            <CardDescription className='font-mono text-gray-400 text-sm'>Customer Satisfaction Rate</CardDescription>
                        </Card>
                        <Card className="w-full   h-fit flex flex-col items-center  gap-2 rounded-none">
                            <CardTitle className="font-bold text-3xl font-mono">30-DAY</CardTitle>
                            <CardDescription className='font-mono text-gray-400 text-sm'>Hassle-Free Returns</CardDescription>
                        </Card>

                    </div>
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.5 }}
                        className="sm:w-full md:w-full lg:w-1/2 relative"
                    >
                        <Card className="rounded-none relative min-w-full max-w-1/2 p-4 aspect-square">

                            <Image
                                src={current.image || "/placeholder.jpg"}
                                alt={current.name}
                                fill
                                className="object-cover rounded"
                            />
                        </Card>
                        <div className="flex gap-4 absolute right-2 top-3">
                            <Button className="" size="" onClick={handlePrev} variant="outline">
                                Prev
                            </Button>
                            <Button size="" className="" onClick={handleNext} variant="outline">
                                Next
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </Card>
            <DiscountSlider discount={discount ?? []} />
        </div>
    );
}
