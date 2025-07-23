"use client";

import { trpc } from "@/hooks/trpc";
import { Button } from "@/components/ui/button";

type PayButtonProps = {
    amount: number;
    orderId: string;
    productDetails: string;
    email: string;
    phoneNumber: string;
};

export default function PayButton({
    amount,
    orderId,
    productDetails,
    email,
    phoneNumber,
}: PayButtonProps) {
    const createPayment = trpc.payment.createPayment.useMutation();

    const handlePay = async () => {
        try {
            const res = await createPayment.mutateAsync({
                amount,
                orderId,
                productDetails,
                email,
                phoneNumber,
            });

            if (res.paymentUrl) {
                window.location.href = res.paymentUrl;
            } else {
                alert("Gagal membuat pembayaran");
            }
        } catch (err) {
            console.error(err);
            alert("Terjadi kesalahan saat membuat pembayaran");
        }
    };

    return (
        <Button className='' size='' variant="vancy" onClick={handlePay} disabled={createPayment.isPending}>
            {createPayment.isPending ? "Processing..." : "Bayar Sekarang"}
        </Button>

    );
}
