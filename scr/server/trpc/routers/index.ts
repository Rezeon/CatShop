import { router } from "../trpc";

import { authRouter } from "./auth";
import { cartItemRouter } from "./cartitem";
import { categoryRouter } from "./category";
import { discountRouter } from "./discount";
import { orderRouter } from "./order";
import { paymentRouter } from "./payment";
import { productRouter } from "./product";
import { reviewRouter } from "./review";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  product: productRouter,
  category: categoryRouter,
  cartItem: cartItemRouter,
  order: orderRouter,
  payment: paymentRouter,
  review: reviewRouter,
  discount: discountRouter,
});

export type AppRouter = typeof appRouter;
