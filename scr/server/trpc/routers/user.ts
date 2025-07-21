import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { protectedProcedure } from "../procedure";
import { hashPassword } from "@/lib/auth";

export const userRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({ where: { id: input } });
  }),
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { password, ...rest } = input;
      const data: any = { ...rest };

      if (password) {
        data.password = await hashPassword(password);
      }

      return ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data,
      });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.user.delete({ where: { id: input } });
  }),
});
