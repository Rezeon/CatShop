import { z } from "zod";
import { router } from "../trpc";
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
});
