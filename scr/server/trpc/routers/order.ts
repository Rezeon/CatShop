import { z } from "zod";
import { router } from "../trpc";
import { protectedProcedure } from "../procedure";
import { OrderStatus } from "@prisma/client";

export const orderRouter = router({
  getMyOrders: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.order.findMany({
      where: { userId: ctx.user.id },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "ADMIN") throw new Error("Not authorized");

    return ctx.prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        payment: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.nativeEnum(OrderStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "ADMIN") throw new Error("Not authorized");

      return ctx.prisma.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
      });
    }),

  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.order.findFirst({
      where: { id: input, userId: ctx.user.id },
      include: { items: true, payment: true },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number(),
            price: z.number(),
          })
        ),
        totalPrice: z.number(),
        shippingAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.order.create({
        data: {
          userId: ctx.user.id,
          totalPrice: input.totalPrice,
          shippingAddress: input.shippingAddress,
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    }),
});
