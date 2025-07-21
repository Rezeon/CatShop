import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { adminProcedure } from "../procedure";

export const discountRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.discount.findMany({
      orderBy: { createdAt: "desc" },
    });
  }),

  getByCode: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.discount.findUnique({
      where: { code: input },
    });
  }),

  create: adminProcedure
    .input(
      z.object({
        code: z.string().min(1),
        description: z.string().optional(),
        percentage: z.number().min(0).max(100).optional(),
        amount: z.number().min(0).optional(),
        startDate: z.string(),
        endDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.discount.create({
        data: {
          code: input.code,
          description: input.description,
          percentage: input.percentage,
          amount: input.amount,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
          active: true,
        },
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string().optional(),
        description: z.string().optional(),
        percentage: z.number().min(0).max(100).optional(),
        amount: z.number().min(0).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (data.startDate)
        data.startDate = new Date(data.startDate).toISOString();
      if (data.endDate) data.endDate = new Date(data.endDate).toISOString();

      return ctx.prisma.discount.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.discount.delete({
      where: { id: input },
    });
  }),
});
