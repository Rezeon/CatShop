"use client";

import { trpc } from "@/hooks/trpc";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingPage from "./ui/loading";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // ✅ pastikan ini benar

type OrderStatus = "PENDING" | "PAID" | "FAILED" | "SHIPPED" | "COMPLETED";

interface Order {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  shippingAddress: string;
  createdAt: string;
  items: {
    id: string;
    product: { name: string };
    quantity: number;
  }[];
}

export default function EditOrder() {
  const { data: orders, isLoading, refetch } = trpc.order.getAll.useQuery();
  const updateStatus = trpc.order.updateStatus.useMutation();

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Record<string, OrderStatus>>({});

  if (isLoading)
    return (
      <div className="w-full h-screen flex justify-center">
        <LoadingPage />
      </div>
    );

  if (!orders || orders.length === 0) {
    return <p className="p-4">You have no orders yet.</p>;
  }

  const handleUpdate = async (orderId: string) => {
    const newStatus = selectedStatus[orderId];
    if (!newStatus) {
      toast.error("Please select a status first.");
      return;
    }
    try {
      setUpdatingId(orderId);
      await updateStatus.mutateAsync({
        orderId: orderId,
        status: newStatus,
      });
      toast.success("Status updated!");
      await refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-2 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      <div className="w-full gap-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {orders.map((order: Order) => (
          <Card className="w-full" key={order.id}>
            <CardHeader className={''}>
              <CardTitle className="flex flex-col md:flex-col lg:flex-row justify-between items-center text-base">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm">{order.id}</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <Badge variant="outline" className="">
                  {order.status}
                </Badge>
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

              <div className="flex flex-col gap-2">
                <Select
                  value={selectedStatus[order.id] || ""}
                  onValueChange={(value : any) =>
                    setSelectedStatus((prev) => ({
                      ...prev,
                      [order.id]: value as OrderStatus,
                    }))
                  }
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent className={''}>
                    <SelectItem className={''} value="PENDING">PENDING</SelectItem>
                    <SelectItem className={''} value="PAID">PAID</SelectItem>
                    <SelectItem className={''} value="FAILED">FAILED</SelectItem>
                    <SelectItem className={''}  value="SHIPPED">SHIPPED</SelectItem>
                    <SelectItem className={''} value="COMPLETED">COMPLETED</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  className=""
                  variant="default"
                  disabled={updatingId === order.id}
                  onClick={() => handleUpdate(order.id)}
                >
                  {updatingId === order.id ? "Updating..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
