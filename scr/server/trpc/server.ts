import { appRouter } from "./routers";
import { createContext } from "./context";

const getApi = async () => {
  const ctx = await createContext();
  return appRouter.createCaller(ctx);
};

export const api = new Proxy({} as Awaited<ReturnType<typeof appRouter.createCaller>>, {
  get(_, prop) {
    throw new Error(`Use: const api = await getApi();`);
  },
});

export { getApi };
