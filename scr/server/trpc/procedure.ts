import { publicProcedure } from "./trpc";
import { isAuthenticated, isAdmin } from "./middleware";

export const protectedProcedure = publicProcedure.use(isAuthenticated);
export const adminProcedure = publicProcedure.use(isAuthenticated).use(isAdmin);
