"use client";

import PreviewProduct from "@/components/preview-product";
import { Label } from "@/components/ui/label";
import { trpc } from "@/hooks/trpc";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import AdsProduct from "@/components/ads-product"
import a from "@/public/icon/a.png"
import b from "@/public/icon/b.png"
import c from "@/public/icon/c.png"
import d from "@/public/icon/d.png"
import e from "@/public/icon/e.png"
import f from "@/public/icon/f.png"
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const pass = {
  name: [
    {
      title: "Passionate Craftmanship",
      description: "Every garment at catshop is crafted with passion reflecting our commitment to quality and innovation",
      image: a
    },
    {
      title: "Global Inspiration",
      description: "influenced by global trends, we bring you a diverse and dynamic collection ",
      image: b
    },
    {
      title: "Fashion Forward",
      description: "we're trendsetters, curating styles that empower and inspire confidence",
      image: c
    },
    {
      title: "Empowering Your Style",
      description: "Beyond clothing, CatShop is a life style, join us on a journey of self-expression",
      image: d
    },
    {
      title: "Customer-Centeric Approach",
      description: "At Cat-Shop, our Customers are at heart of everything we do",
      image: e
    },
    {
      title: "Sustainable Practices",
      description: "Cat-Shop is committed to sustainability, integrating eco-friendly practices into our production process.",
      image: f
    },
  ],
  experience: [
    {
      no: "01",
      title: "Discover trends",
      description: "Explore our curated collection of over 1000 styles"
    },
    {
      no: "02",
      title: "Secure checkout",
      description: "add your items to the cart item and proceed to our secure checkout"
    },
    {
      no: "03",
      title: "Swift dispatch",
      description: "Experience 95% same-day dispatch on order"
    },
    {
      no: "04",
      title: "Unbox Happiness",
      description: "Recieve your carefully packaget catshop order"
    },
  ]
}

export default function Page() {
  const { data: bajuCategory } = trpc.category.getBySlug.useQuery(
    "baju"
  );

  const { data: sepatuCategory } = trpc.category.getBySlug.useQuery(
    "sepatu"
  );

  const { data: topiCategory } = trpc.category.getBySlug.useQuery(
    "topi",
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <AdsProduct />
      <br />
      <div className="w-full flex justify-between">
        <Label className="font-bold text-3xl">Clothes</Label>
        <Link href="/category/baju" className="text-gray-500 font-semibold text-lg hover:underline font-mono">view</Link>
      </div>
      <ScrollArea className="w-full" >
        <div className="flex gap-4 w-max font-sans p-4">
          <PreviewProduct products={bajuCategory?.products ?? []} />
        </div>
        <ScrollBar className="" orientation="horizontal" />
      </ScrollArea>

      <div className="w-full flex justify-between">
        <Label className="font-bold text-3xl">Shoes</Label>
        <Link href="/category/sepatu" className="text-gray-500 font-semibold text-lg hover:underline font-mono">view</Link>
      </div>
      <ScrollArea className="w-full" >
        <div className="flex gap-4 w-max font-sans p-4">
          <PreviewProduct products={sepatuCategory?.products ?? []} />
        </div>
        <ScrollBar className="" orientation="horizontal" />
      </ScrollArea>

      <div className="w-full flex justify-between">
        <Label className="font-bold text-3xl">Hat</Label>
        <Link href="/category/topi" className="text-gray-500 font-semibold text-lg hover:underline font-mono">view</Link>
      </div>
      <ScrollArea className="w-full" >
        <div className="flex gap-4 w-max font-sans p-4">
          <PreviewProduct products={topiCategory?.products ?? []} />
        </div>
        <ScrollBar className="" orientation="horizontal" />
      </ScrollArea>
      <div className="flex justify-center flex-col w-full h-1/4 p-10">
        <div className="flex flex-col gap-6 w-full p-4">
          <Label className=" font-bold text-2xl " >Cat-Shop.</Label>
          <p className="text-sm font-medium text-gray-400" >At Klothink, we breathe life into fashion, blending creativity with commitment. Our journey is fueled by a dedication to delivering unparalleled style and quality. Join us in redefining fashion and embracing a community where every purchase tells a story.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 m-3 border grid-rows-2 w-full p-3 bg-gray-100 rounded-lg">
          {pass.name.map((item: any) => (
            <div key={item.title} className=" items-start w-[95%] font-sans border p-4 m-2 bg-white rounded-lg flex flex-col gap-6" >
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex gap-3">
                    <Image
                      src={item.image}
                      width={20}
                      height={20}
                      className="w-8 h-8"
                      alt={item.title}
                    />

                    <Label className="font-bold text-lg">{item.title}</Label>
                  </div>
                  <p className="text-sm font-medium text-gray-400">{item.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6 font-sans m-3 p-3">
        <div className="flex flex-col gap-6 w-full p-4">
          <Label className=" font-bold text-2xl " >SEAMLESS EXPERIEANCE</Label>
          <p className="text-sm font-medium text-gray-400" >At Klothink, we`ve designed a straightforward shopping experience to make fashion accessible. Explore the journey from discovering the latest trends to receiving your handpicked styles with ease.</p>
        </div>
        <div className="md:grid lg:grid sm:grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-full p-4 border shadow rounded-lg">
          {pass.experience.map((item) => (
            <div key={item.no} className="w-[95%] bg-gray-100 flex flex-col gap-2 border p-2 rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="font-mono text-4xl text-gray-400">{item.no}</p>
                  <Label className="font-bold font-sans text-2xl">{item.title}</Label>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
