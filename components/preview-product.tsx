"use client";

import Image from "next/image";
import { trpc } from "@/hooks/trpc";
import star from "@/public/icon/Star.png";
import add from "@/public/icon/Interface/Shopping_Cart_01.png";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cva } from "class-variance-authority";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot"

const variantPrevew = cva(
  "",
  {
    variants: {
      variant: {
        scrl: "flex gap-4 w-max font-sans",
        gidr: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-sans"
      }
    },
    defaultVariants: {
      variant: "scrl"
    }
  }
)

export default function PreviewProduct({
  onEdit,
  products,
  variant = "scrl",
  asChild = false,
  ...props
}: {
  onEdit?: (product: any) => void;
  products?: any;
  variant?: "scrl" | "gidr";
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) 
{
  const Comp = asChild ? Slot : "preview"
  const utils = trpc.useUtils();
  const { data: reviews } = trpc.review.getAll.useQuery();
  const { data: user } = trpc.auth.getUser.useQuery();
  const router = useRouter();
  const handleGoPrev = (id: string) => {
    router.push(`/product/${id}`);
  };
  const { mutate: addOrUpdateCart } = trpc.cartItem.addOrUpdate.useMutation({
    onSuccess: () => {
      utils.cartItem.getAll.invalidate();
      toast.success("You add some item!");
    },
    onError: (error) => {
      toast.error("Please add item first");
    },
  });

  const handleAddToCart = (productId: string, quantity: number) => {
    addOrUpdateCart({
      productId,
      quantity,
    });
  };

  return (
    <div data-slot="preview" className={cn(variantPrevew({ variant }))} {...props} >
      {products?.map((prod: any) => {
        const productReviews =
          reviews?.filter((review) => review.productId === prod.id) || [];

        const totalRating = productReviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        const averageRating =
          productReviews.length > 0 ? totalRating / productReviews.length : 0;

        return (
          <div
            key={prod.id}
            className="w-[200px] min-w-[200px] shadow hover:shadow-lg transition overflow-hidden bg-white flex flex-col gap-1"
          >
            <div className="relative w-full h-[200px]">
              <Image
                src={prod.image || "/placeholder.jpg"}
                alt={prod.slug}
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <div className="p-3 flex flex-col gap-2">
              <div className="text-sm font-semibold line-clamp-1">
                {prod.name}
              </div>
              <div className="text-base text-gray-600">
                Rp{prod.price.toLocaleString("id-ID")}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Image
                  src={star}
                  className="w-4 h-4 filter brightness-0"
                  alt="star"
                />
                <span>{averageRating.toFixed(1)}</span>
                <span>({productReviews.length} review)</span>
              </div>
              <div>
                {user?.role === "ADMIN" ? (
                  <Button
                    className="w-full h-8 rounded-none"
                    variant="vancy"
                    size="default"
                    onClick={() => onEdit && onEdit(prod)}
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      className="w-[40%] h-8 rounded-none font-sans text-[12px]"
                      variant="vancy"
                      size="default"
                      onClick={() => handleGoPrev(prod.id)}
                    >
                      Detail
                    </Button>
                    <Button
                      className="h-8 rounded-none text-[12px] group"
                      variant="vancy"
                      size="default"
                      onClick={() => handleAddToCart(prod.id, 1)}
                    >
                      <Image
                        src={add}
                        className="w-6 h-6 filter brightness-0 transition-all group-hover:filter-none"
                        alt="add"
                      />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

}
