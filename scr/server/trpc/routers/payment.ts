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

  create: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        method: z.string(),
        status: z.string(),
        snapToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.payment.create({
        data: {
          ...input,
        },
      });
    }),
   createInvoice: protectedProcedure
    .input(
      z.object({
        paymentAmount: z.number(),
        orderId: z.string(),
        productDetails: z.string(),
        email: z.string().email(),
        phoneNumber: z.string(),
        customerVaName: z.string(),
        items: z.array(
          z.object({
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
          })
        ),
        customerDetail: z.object({
          firstName: z.string(),
          lastName: z.string(),
          address: z.string(),
          city: z.string(),
          postalCode: z.string(),
          countryCode: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const merchantCode = process.env.DUITKU_MERCHANT_CODE!;
      const merchantKey = process.env.DUITKU_API_KEY!;

      const timestamp = Date.now().toString(); 
      const signature = crypto
        .createHash("sha256")
        .update(merchantCode + timestamp + merchantKey)
        .digest("hex");

      const payload = {
        paymentAmount: input.paymentAmount,
        merchantOrderId: input.orderId,
        productDetails: input.productDetails,
        additionalParam: "",
        merchantUserInfo: "",
        customerVaName: input.customerVaName,
        email: input.email,
        phoneNumber: input.phoneNumber,
        itemDetails: input.items,
        customerDetail: {
          firstName: input.customerDetail.firstName,
          lastName: input.customerDetail.lastName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          billingAddress: {
            firstName: input.customerDetail.firstName,
            lastName: input.customerDetail.lastName,
            address: input.customerDetail.address,
            city: input.customerDetail.city,
            postalCode: input.customerDetail.postalCode,
            phone: input.phoneNumber,
            countryCode: input.customerDetail.countryCode,
          },
          shippingAddress: {
            firstName: input.customerDetail.firstName,
            lastName: input.customerDetail.lastName,
            address: input.customerDetail.address,
            city: input.customerDetail.city,
            postalCode: input.customerDetail.postalCode,
            phone: input.phoneNumber,
            countryCode: input.customerDetail.countryCode,
          },
        },
        callbackUrl: `${process.env.BASE_URL}/api/duitku-callback`,
        returnUrl: `${process.env.BASE_URL}/payment-success`,
        expiryPeriod: 10,
      };

      const response = await fetch(
        "https://api-sandbox.duitku.com/api/merchant/createinvoice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-duitku-signature": signature,
            "x-duitku-timestamp": timestamp,
            "x-duitku-merchantcode": merchantCode,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Create Invoice Payload:", payload);
      console.log("Create Invoice Response:", data);

      if (response.status !== 200) {
        throw new Error("Failed to create invoice: " + JSON.stringify(data));
      }

      return {
        paymentUrl: data.paymentUrl,
        reference: data.reference,
        statusCode: data.statusCode,
        statusMessage: data.statusMessage,
      };
    }),
});
