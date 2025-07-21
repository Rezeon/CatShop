import { Button } from "./button";
import add from "@/public/icon/Interface/Shopping_Cart_01.png";
import Image from "next/image";
import { trpc } from "@/hooks/trpc";
import { useRouter } from "next/navigation";

export default function ButtonCart() {
  const { data: cartItem } = trpc.cartItem.getAll.useQuery();

  const router = useRouter();

  const handleRoute = () => {
    router.push("/cartitem")
  }
  
  return (
    <Button
      variant="vancy"
      size="default"
      className="w-[5%] h-full border-none hover:bg-black rounded-none flex relative group"
      onClick={handleRoute}
    >
      <Image
        src={add}
        className="w-4 h-4 filter brightness-0 group-hover:filter-none transition-all duration-200"
        alt="cart"
      />
      {(cartItem?.length ?? 0) > 0 && <div className="underline">{cartItem?.reduce((acc, item) => acc + item.quantity, 0) ?? 0}</div>}
    </Button>
  );
}
