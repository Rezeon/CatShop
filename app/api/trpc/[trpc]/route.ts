import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/scr/server/trpc/routers';
import { createContext } from '@/scr/server/trpc/context';

export const GET = handler;
export const POST = handler;

async function handler(req: Request): Promise<Response> {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext,
  });
}
