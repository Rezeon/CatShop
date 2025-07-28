"use client";

import { trpc } from "@/hooks/trpc";
import Image from "next/image";
import toast from "react-hot-toast";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CartItem() {
  const { data: cartItems } = trpc.cartItem.getAll.useQuery();
  const [code, setCode] = useState("")
  const { data: discountData } = trpc.discount.getByCode.useQuery(code);
  const utils = trpc.useUtils();
  const [shippingAddress, setShippingAddress] = useState("");
  const [phoneNumber, setphoneNumber] = useState("")
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [city, setcity] = useState("");
  const [postalCode, setpostalCode] = useState("");
  const { data: user } = trpc.auth.getUser.useQuery();
  const { mutateAsync: createPayment } = trpc.payment.createInvoice.useMutation();

  const [shippingMethod, setShippingMethod] = useState<"free" | "priority">(
    "free"
  );

  const { mutate: addOrUpdateCart } = trpc.cartItem.addOrUpdate.useMutation({
    onSuccess: () => {
      utils.cartItem.getAll.invalidate();
      toast.success("Item updated!");
    },
    onError: () => {
      toast.error("Update failed");
    },
  });
  const { mutate: deleteCart } = trpc.cartItem.delete.useMutation({
    onSuccess: () => {
      utils.cartItem.getAll.invalidate();
      toast.success("Item remove!");
    },
    onError: () => {
      toast.error("remove failed");
    },
  });

  const { mutateAsync: createOrderAsync } = trpc.order.create.useMutation({
    onSuccess: () => {
      utils.cartItem.getAll.invalidate();
      toast.success("Order created!");
    },
    onError: () => {
      toast.error("Failed to create order.");
    },
  });

  const handleUpdateQuantity = (
    productId: string,
    newQuantity: number,
    stock: number
  ) => {
    if (newQuantity < 1) return toast.error("Minimum quantity 1");
    if (newQuantity > stock) return toast.error("Out of Stock");
    addOrUpdateCart({
      productId,
      quantity: newQuantity,
    });
  };

  const handleDelete = (id: string) => {
    deleteCart({
      id,
    });
  };

  const totalPrice =
    cartItems?.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    ) ?? 0;

  const totalItem =
    cartItems?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const shipping = shippingMethod === "free" ? 0 : 10_000;
  const discountValue = discountData?.amount ?? 0;

  const grandTotal = totalPrice - discountValue + shipping;

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) {
      return toast.error("Your cart is empty!");
    }
    if (!shippingAddress) {
      return toast.error("Address is required!");
    }
    if (!phoneNumber) {
      return toast.error("Phone number is required!");
    }

    const items = cartItems.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await createOrderAsync({
      items: orderItems,
      shippingAddress,
      totalPrice: grandTotal,
    });

    if (!order.id) {
      return toast.error("Failed to create Order!");
    }

    const email = user?.email ?? "";

    try {
      const payment = await createPayment({
        paymentAmount: grandTotal,
        orderId: order.id,
        productDetails: "Pembelian dari ChillShop",
        email,
        phoneNumber,
        customerVaName: `${firstName} ${lastName}`,
        items,
        customerDetail: {
          firstName: firstName,
          lastName: lastName,
          address: shippingAddress,
          city: city, 
          postalCode: postalCode, 
          countryCode: "ID",
        },
      });

      if (!payment.paymentUrl) {
        return toast.error("Failed to create payment!");
      }

      window.location.href = payment.paymentUrl;
    } catch (err) {
      toast.error("Checkout failed!");
      console.error(err);
    }
  };



  return (
    <div className="p-2 md:p-4 lg:p-6 flex gap-6 flex-col md:flex-col justify-center md:justify-center items-center md:items-center lg:flex-row lg:items-baseline lg:justify-between">
      <div className="w-[100%] md:w-[90%] lg:w-[50%] flex flex-col">
        <div className="font-bold text-[20px] w-full p-4 font-sans flex items-center text-center">
          Cart : {totalItem}
        </div>

        <div className="flex flex-col gap-2 p-2">
          {cartItems?.map((item) => (
            <div key={item.id}>
              <div className="p-2 flex w-full h-[120px] md:h-[120px] lg:h-[160px] border">
                <div className="relative aspect-square mr-2">
                  <Image
                    src={item.product.image ?? "/placeholder.jpg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="w-[100%] h-full flex flex-col gap-1 md:gap-2 lg:gap-4 justify-start">
                  <div className="w-full flex items-center justify-between p-1">
                    <p className="font-bold text-wrap text-[12px] md:text-[12px] lg:text-[16px] font-sans">
                      {item.product.name}
                    </p>
                    <p className="font-bold text-[12px] md:text-[16px] lg:text-[16px] font-sans">
                      Rp{item.product.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-col lg:flex-col w-full sm:gap-0.5 md:gap-0.5 lg:gap-2 p-1">
                    <p className="text-[10px] font-semibold text-gray-500">
                      Stock: {item.product.stock}
                    </p>
                    <div className="w-full flex flex-row md:flex-row lg:flex-row lg:items-center justify-between">
                      <div className="w-[40%] h-[40px] flex items-center border mt-1 md:mt-1 lg:mt-5">
                        <div
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.product.stock
                            )
                          }
                          className="w-1/3 cursor-pointer h-full flex justify-center items-center text-center font-semibold font-sans text-[12px] md:text-[12px] lg:text-[24px] hover:bg-gray-400"
                        >
                          +
                        </div>
                        <div className="w-1/3 h-full flex justify-center items-center text-center font-semibold font-sans text-[12px] md:text-[12px] lg:text-[24px]">
                          {item.quantity}
                        </div>
                        <div
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.product.stock
                            )
                          }
                          className="w-1/3 cursor-pointer h-full flex justify-center items-center text-center font-semibold font-sans text-[12px] md:text-[12px] lg:text-[24px] hover:bg-gray-400"
                        >
                          -
                        </div>
                      </div>
                      <div>
                        <Button
                          className="bg-red-600 text-white h-[30px] md:h-[20px] lg:h-[40px]"
                          variant="vancy"
                          size="default"
                          onClick={() => handleDelete(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="mt-3 mb-4" />
            </div>
          ))}
        </div>
      </div>
      <div className="w-[90%] md:w-[90%] lg:w-[30%] h-9/12 gap-10 flex flex-col p-8 border">
        <p className="font-bold text-[16px] font-sans">Order Summary</p>
        <div
          className="flex flex-col gap-2 mt-4 font-sans
        "
        >
          <div className="flex justify-between">
            <p>Price</p>
            <p>Rp{totalPrice.toLocaleString("id-ID")}</p>
          </div>
          <div className="flex justify-between">
            <p>Discount</p>
            <p>Rp{discountData?.amount?.toLocaleString("id-ID")}</p>
          </div>
          <Label className="mt-4">Select Shipping Method</Label>
          <Select
            value={shippingMethod}
            onValueChange={(value: any) => {
              if (value === "free" || value === "priority") {
                setShippingMethod(value);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select shipping" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem className="" value="free">
                Free
              </SelectItem>
              <SelectItem className="" value="priority">
                Priority (+Rp10.000)
              </SelectItem>
            </SelectContent>
          </Select>
          <Label className="w-full font-sans ">Phone Number</Label>
          <Input type="text" className='' value={phoneNumber} onChange={(e: any) => setphoneNumber(e.target.value)} placeholder="Masukan nomer hp" />
          <Label className="w-full font-sans ">Add Address</Label>
          <Input
            type="text"
            placeholder="Address"
            value={shippingAddress}
            className="w-full"
            onChange={(e: any) => setShippingAddress(e.target.value)}
          />
          <Label className=''>City</Label>
          <Input className='' type="text" value={city} onChange={(e:any) => setcity(e.target.value)} />

          <Label className=''>Postal Code</Label>
          <Input className='' type="text" value={postalCode} onChange={(e:any) => setpostalCode(e.target.value)} />

          <Label className=''>First Name</Label>
          <Input className='' type="text" value={firstName} onChange={(e:any) => setfirstName(e.target.value)} />

          <Label className=''>Last Name</Label>
          <Input className='' type="text" value={lastName} onChange={(e:any) => setlastName(e.target.value)} />

          <Label className="">Discount Code</Label>
          <Input type="text" className="" value={code} onChange={(e: any) => setCode(e.target.value)} placeholder="Masukkan kode diskon" />

        </div>
        <hr />
        <div className="flex justify-between font-bold">
          <p>Grand Total</p>
          <p>Rp{grandTotal.toLocaleString("id-ID")}</p>
        </div>
        <div className="flex justify-between">
          <p>Total items</p>
          <p>{totalItem}</p>
        </div>

        <Button
          onClick={handleCheckout}
          variant="vancy"
          size="default"
          className="mt-6 bg-black text-white py-3 px-6 rounded hover:bg-gray-800 disabled:opacity-50"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
}
