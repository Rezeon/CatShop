import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { adminProcedure } from "../procedure";

export const categoryRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),

  getBySlug: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.category.findUnique({
      where: { slug: input },
      include: {
        products: true,
      },
    });
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.category.create({
        data: input,
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        slug: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return ctx.prisma.category.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.category.delete({
      where: { id: input },
    });
  }),
});
