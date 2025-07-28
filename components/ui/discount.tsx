"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
    id: string;
    description: string | null;
    amount: number | null;
    percentage: number | null;
    startDate: string;
    endDate: string;
    code: any;
};

export default function DiscountSlider({ discount }: { discount: Product[] }) {
    const discounted = discount.filter(p => (p.percentage ?? 0) > 0);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (discounted.length <= 1) return;

        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % discounted.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [discounted.length]);

    if (discounted.length === 0) {
        return <p>No discounts</p>;
    }

    const current = discounted[index];
    const formattedStart = new Date(current.startDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const formattedEnd = new Date(current.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });


    return (
        <div className="transition-transform flex flex-wrap h-auto pt-1 pb-1 pl-4 pr-4 overflow-hidden relative border font-mono font-semibold rounded-md  bg-gray-300">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="text-center w-full items-center flex gap-1 text-[10px] md:text-sm lg:text-sm justify-center"
                >
                    <p>{current.description}</p>|
                    <p>Rp{current.amount}</p> 
                    <p>{current.percentage}%</p> |
                    <p>Start at: {formattedStart}</p> |
                    <p>End at: {formattedEnd}</p> |
                    <p>code discount :{current.code}</p> |

                </motion.div>
            </AnimatePresence>
        </div>
    );
}
