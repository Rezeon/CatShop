import { z } from "zod";
import crypto from "crypto";
import { publicProcedure, router } from "../trpc";
import { protectedProcedure } from "../procedure";

export const paymentRouter = router({
  getByOrderId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.payment.findUnique({
      where: { orderId: input },
    });
  }),

  create: protectedProcedure.input(
    z.object({
      orderId: z.string(),
      method: z.string(),
      status: z.string(),
      snapToken: z.string().optional(),
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.payment.create({
      data: {
        ...input,
      },
    });
  }),
  createPayment: publicProcedure
    .input(
      z.object({
        amount: z.number(),
        orderId: z.string(),
        productDetails: z.string(),
        email: z.string().email(),
        phoneNumber: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
      const apiKey = process.env.DUITKU_API_KEY!;
      const paymentUrl = "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry";

      const { amount, orderId, productDetails, email, phoneNumber } = input;

      const signature = crypto
        .createHash("md5")
        .update(merchantCode + orderId + amount + apiKey)
        .digest("hex");

      const payload = {
        merchantCode,
        paymentAmount: amount,
        merchantOrderId: orderId,
        productDetails,
        email,
        phoneNumber,
        returnUrl: `${process.env.BASE_URL}/payment-success`,
        callbackUrl: `${process.env.BASE_URL}/api/duitku-callback`,
        signature,
        expiryPeriod: 60,
      };

      const res = await fetch(paymentUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Payload:", payload);
console.log("Duitku response:", data);


      if (!data.paymentUrl) {
        throw new Error("Gagal membuat payment");
      }

      return { paymentUrl: data.paymentUrl };
    }),
});

