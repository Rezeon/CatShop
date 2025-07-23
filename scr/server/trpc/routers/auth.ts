import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { verifyPassword, signToken } from "@/lib/auth";
import { protectedProcedure } from "../procedure";
import { hashPassword } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const authRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });
      if (!user) throw new Error("Email Not Found");

      const isValid = await verifyPassword(input.password, user.password);
      if (!isValid) throw new Error("Password salah");

      const token = signToken({ id: user.id, role: user.role });
      const cookieStore = await cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return {
        success: true,
        user: { id: user.id, email: user.email, role: user.role },
      };
    }),
getUser: protectedProcedure.query(({ ctx }) => {
  return ctx.prisma.user.findUnique({
    where: { id: ctx.user.id },
    select: {
      id: true,
      role: true,
      email: true,
    },
  });
}),


  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["USER", "ADMIN"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const hashPass = await hashPassword(input.password);
      return ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashPass,
          role: input.role ?? "USER",
        },
      });
    }),
  logout: publicProcedure.mutation(async () => {
    const response = NextResponse.json({ message: "Logout berhasil" });

    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    });

    return response;
  }),
});
