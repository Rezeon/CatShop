import Link from "next/link";
import Image from "next/image";
import { trpc } from "@/hooks/trpc";
import { useParams } from "next/navigation";
import star from "@/public/icon/Star.png";
import Back from "@/public/icon/back.png";
import LoadingPage from "./ui/loading";
import { useState } from "react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
type RouteParams = {
  id: string;
};

export default function DetailProduct() {
  const params = useParams<RouteParams>();
  const id = params.id;
  const utils = trpc.useUtils();

  const [Quantity, setQuantity] = useState(0);
  const { data: productSelect } = trpc.product.getById.useQuery(id);
  const productReviews = productSelect?.reviews ?? [];

  const { mutate: addOrUpdateCart } = trpc.cartItem.addOrUpdate.useMutation({
    onSuccess: () => {
      utils.cartItem.getAll.invalidate();
      toast.success("You add some item!");
    },
    onError: (error) => {
      toast.error("Please add item first");
    },
  });

  const handleAddToCart = () => {
    if (!productSelect) return;

    addOrUpdateCart({
      productId: productSelect.id,
      quantity: Quantity,
    });
  };

  const handleIncrement = () => {
    if (!productSelect) return;
    if (Quantity >= productSelect.stock) return toast.error("Out of Stock");

    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const totalRating = productReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating =
    productReviews.length > 0 ? totalRating / productReviews.length : 0;

  if (!productSelect)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingPage />
      </div>
    );

  return (
    <div className="w-full p-4 flex flex-col-reverse justify-around gap-2 md:flex-row lg:flex-row font-serif">
      <div className="lg:w-[40%] max-h-100vh w-full gap-5 relative">
        <div className="flex flex-col gap-2 mb-16">
          <Link href="/" className="block p-3 w-[40px] h-[40px]">
            <Image
              src={Back}
              alt="Back"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>

          <div className="w-[60%] h-auto text-sm ml-[3%]">
            Categoty : {productSelect.category?.name}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 justify-center items-start">
          <h2 className="text-sm lg:text-2xl font-bold mt-2 mb-2">
            {productSelect.name}
          </h2>
          <hr />
          <div className="flex w-full justify-between">
            <p className="mb-4 mt-4 text-lg font-[500]">
              Rp{productSelect.price.toLocaleString("id-ID")}
            </p>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Image
                src={star}
                className="w-4 h-4 filter brightness-0"
                alt="star"
              />
              <span>{averageRating.toFixed(1)} / 5</span>
              <span>({productReviews.length} review)</span>
            </div>
          </div>
          <p className="mb-2 text-sm font-sans">{productSelect.description}</p>
        </div>
        <div className="flex justify-between w-full mt-3">
          <div className="w-[30%] h-[60px]">
            <div className="w-full h-[52px] flex items-center border">
              <div
                onClick={handleIncrement}
                className="w-1/3 cursor-pointer h-full flex justify-center items-center text-center font-semibold font-sans text-[24px] hover:bg-gray-400"
              >
                +
              </div>
              <div className="w-1/3 h-full flex justify-center items-center text-center font-semibold font-sans text-[24px]">
                {Quantity}
              </div>
              <div
                onClick={handleDecrement}
                className="w-1/3 cursor-pointer h-full flex justify-center items-center text-center font-semibold font-sans text-[24px] hover:bg-gray-400"
              >
                -
              </div>
            </div>
            <div className="font-sans pt-2 pr-2 text-gray-400">Stock Item: {productSelect.stock}</div>
          </div>
          <Button
            className="w-[30%] h-[52px] "
            variant="vancy"
            size="default"
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
        </div>
      </div>
      <div className="w-full lg:w-[40%] flex justify-center items-center">
        <div className="w-full aspect-square relative">
          <Image
            src={productSelect.image ?? "/placeholder.jpg"}
            alt={productSelect.name}
            fill
            className="object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
}
