import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { adminProcedure } from "../procedure";

export const productRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  getAllC: publicProcedure
    .input(z.object({ categorySlug: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.product.findMany({
        where: input.categorySlug
          ? { category: { slug: input.categorySlug } }
          : {},
        include: { category: true },
      });
    }),
  getByName: publicProcedure
    .input(z.object({ q: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.product.findMany({
        where: {
          name: {
            contains: input.q,
            mode: "insensitive",
          },
        },
        take: 10,
      });
    }),

  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.product.findUnique({
      where: { id: input },
      include: {
        category: true,
        reviews: true,
      },
    });
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().min(1),
        price: z.number().min(0),
        stock: z.number().min(0),
        image: z.string().url().optional(),
        categoryId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.product.create({
        data: input,
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        image: z.string().url().optional(),
        categoryId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.product.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.product.delete({ where: { id: input } });
  }),
});
