"use client";

import { trpc } from "@/hooks/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingPage from "./ui/loading";

export default function OrderHistory() {
  const { data: orders, isLoading } = trpc.order.getMyOrders.useQuery();

  if (isLoading) return (
    <div className="w-full h-screen flex justify-center items-center">
        <LoadingPage />
    </div>
  );

  if (!orders || orders.length === 0) {
    return <p className="p-4">You have no orders yet.</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <Card className="w-full " key={order.id}>
            <CardHeader className="w-full "  >
              <CardTitle className="flex flex-col md:flex-col lg:flex-row justify-between items-center text-base">
                <span className="text-gray-600 ">Order ID:</span>
                <span className="font-mono text-sm">{order.id}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className=""  variant="outline">{order.status}</Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Total Price:</span>
                <span className="font-semibold">
                  Rp{order.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              <div>
                <p className="font-semibold mb-1">Items:</p>
                <ul className="list-disc list-inside text-sm">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-muted-foreground">
                Created at: {new Date(order.createdAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
