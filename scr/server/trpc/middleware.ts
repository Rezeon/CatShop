import { TRPCError } from "@trpc/server";
import { middleware } from "./trpc";
import { getAuthUser } from "@/lib/auth";

export const isAuthenticated = middleware(({ctx, next}) => {
    const user = getAuthUser();
    if (!user) throw new TRPCError({code: "UNAUTHORIZED"});

    return next({ctx: { ...ctx , user: ctx.user as NonNullable<typeof ctx.user>}});
})

export const isAdmin = middleware(async ({ ctx, next }) => {
  const user = await getAuthUser();
  if (!user || user.role !== "ADMIN") {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: {ctx, user } });
});