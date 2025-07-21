"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { trpc } from "@/hooks/trpc";
import toast from "react-hot-toast";

export default function AddDiscount() {
    const [form, setForm] = useState<{
        code: string;
        description: string;
        percentage: number;
        amount: number;
    }>({
        code: "",
        description: "",
        percentage: 0,
        amount: 0,
    });

    const utils = trpc.useUtils();

    const createDiscount = trpc.discount.create.useMutation({
        onSuccess: () => {
            toast.success("Discount berhasil ditambahkan");
            setForm({
                code: "",
                description: "",
                percentage: 0,
                amount: 0,
            });
            utils.discount.getAll.invalidate();
        },
        onError: () => toast.error("Gagal menambahkan Discount"),
    })

    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createDiscount.mutate({
            ...form,
            startDate: dateRange?.from?.toISOString() || "",
            endDate: dateRange?.to?.toISOString() || "",
        });


    };

    return (
        <div>
            <Card className="w-full max-w-sm">
                <CardHeader className=''>
                    <CardTitle className=''>Add Discount</CardTitle>
                    <CardDescription className=''>Enter your discount details</CardDescription>
                </CardHeader>
                <CardContent className=''>
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="grid gap-2">
                            <Label className='' htmlFor="code">Code</Label>
                            <Input
                                className=''
                                value={form.code}
                                onChange={(e: any) =>
                                    setForm({ ...form, code: e.target.value })
                                }
                                id="code"
                                type="text"
                                placeholder="DISCOUNT2024"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className='' htmlFor="description">Description</Label>
                            <Input
                                className=''
                                value={form.description}
                                onChange={(e: any) =>
                                    setForm({ ...form, description: e.target.value })
                                }
                                id="description"
                                type="text"
                                placeholder="10% off for first order"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className='' htmlFor="percentage">Percentage (%)</Label>
                            <Input
                                className=''
                                value={form.percentage}
                                onChange={(e: any) =>
                                    setForm({
                                        ...form,
                                        percentage: Number(e.target.value),
                                    })
                                }
                                id="percentage"
                                type="number"
                                placeholder="10"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className='' htmlFor="amount">Amount (Rp)</Label>
                            <Input
                                className=''
                                value={form.amount}
                                onChange={(e: any) =>
                                    setForm({ ...form, amount: Number(e.target.value) })
                                }
                                id="amount"
                                type="number"
                                placeholder="50000"
                            />
                        </div>

                        <Label className='' htmlFor="date-range">Date Range</Label>
                        <div className=" items-center justify-center flex flex-col gap-2">
                            <Calendar

                                mode="range"
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={1}
                                className="rounded-lg border shadow-sm"
                                classNames={{}}
                                formatters={{}}
                                components={{}}
                            />
                            <div className="text-muted-foreground text-center text-xs">
                                Select valid start and end date
                            </div>
                        </div>

                        <Button variant='vancy' size='default' type="submit" className="w-full">
                            Add Discount
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
