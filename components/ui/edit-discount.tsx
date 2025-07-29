"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/hooks/trpc";
import toast from "react-hot-toast";
import { Button } from "./button";

type Product = {
    id: string;
    description: string | null;
    amount: number | null;
    percentage: number | null;
    startDate: string;
    endDate: string;
    code: any;
};

export default function DiscountEdit({ discount }: { discount: Product }) {
    const { data: user } = trpc.auth.getUser.useQuery();
    const utils = trpc.useUtils();

    const formattedStart = new Date(discount.startDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const formattedEnd = new Date(discount.endDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const deleteDiscount = trpc.discount.delete.useMutation({
        onSuccess: () => {
            toast.success("discount dihapus");
            utils.discount.getAll.invalidate();
        },
        onError: () => {
            toast.error("Gagal menghapus discount")
        }
    })

    const handleDelete = (id: string) => {
        deleteDiscount.mutate(id);
    }


    return (
        <div className="h-auto p-4 border font-mono font-semibold rounded-md bg-gray-300">

            <div>{discount.description}</div>
            <div>Rp{discount.amount}</div>
            <div>{discount.percentage}%</div> 
            <div>Start at: {formattedStart}</div> 
            <div>End at: {formattedEnd}</div> 
            <div>code discount :{discount.code}</div> 

            {user?.role === "ADMIN" && (
                <div className="">
                    <Button
                        size=''
                        variant="vancy"
                        className="w-full p-1 text-lg rounded-lg"
                        onClick={() => handleDelete(discount.id)}
                    >
                        Delete
                    </Button>
                </div>
            )}

        </div>
    );
}
