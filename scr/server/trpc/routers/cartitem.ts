import { z } from "zod";
import { router } from "../trpc";
import { protectedProcedure } from "../procedure";

export const cartItemRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.cartItem.findMany({
      where: { userId: ctx.user.id },
      include: { product: true },
    });
  }),

  addOrUpdate: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, quantity } = input;

      return ctx.prisma.cartItem.upsert({
        where: {
          userId_productId: {
            userId: ctx.user.id,
            productId,
          },
        },
        update: { quantity },
        create: {
          userId: ctx.user.id,
          productId,
          quantity,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.cartItem.delete({
        where: { id: input.id },
      });
    }),
});
