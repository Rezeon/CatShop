import { PrismaClient } from "@prisma/client";
import { getAuthUser } from "@/lib/auth";

const prisma = new PrismaClient();

export const createContext = async () => {
  const user = await getAuthUser(); 
  return { prisma, user };    
};

export type Context = {
  prisma: PrismaClient;
  user: { id: string; role: string } | null;
};
