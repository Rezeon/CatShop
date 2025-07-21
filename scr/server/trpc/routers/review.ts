import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { protectedProcedure } from "../procedure";

export const reviewRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.review.findMany({
      include: { user: true },
    });
  }),
  getByProductId: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.review.findMany({
      where: { productId: input },
      include: { user: true },
    });
  }),

  addOrUpdate: protectedProcedure.input(
    z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      comment: z.string().min(1),
    })
  ).mutation(async ({ ctx, input }) => {
    return ctx.prisma.review.upsert({
      where: {
        userId_productId: {
          userId: ctx.user.id,
          productId: input.productId,
        },
      },
      update: {
        rating: input.rating,
        comment: input.comment,
      },
      create: {
        userId: ctx.user.id,
        productId: input.productId,
        rating: input.rating,
        comment: input.comment,
      },
    });
  }),
});
