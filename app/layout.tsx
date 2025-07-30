"use client";

import "./globals.css";
import Link from "next/link";

import { Analytics } from '@vercel/analytics/next';
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import { ReactQueryClientProvider } from "@/utils/react-query-provider";
import { Toaster } from "react-hot-toast";

import { AutocompleteProduct } from "@/components/search-product"
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ButtonCart from "@/components/ui/buttonCart"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryClientProvider>
          <SidebarProvider
            open={isOpen}
            onOpenChange={setIsOpen}
            className=""
            style={{}}
          >
            <AppSidebar className="z-50" />
            <SidebarInset className="flex flex-col min-h-screen relative z-0">
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 relative z-10">
                <div className="flex flex-row items-center gap-2 justify-between">
                  <SidebarTrigger
                    onClick={() => setIsOpen(!isOpen)}
                    className="-ml-1"
                  />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                  />
                </div>
                <AutocompleteProduct />
                <ButtonCart />
                <Link href="/" className="font-sans flex items-center justify-center border bg-white pr-3 pl-3 pt-1.5 pb-1.5 rounded-full hover:bg-gray-200">
                  Home
                </Link>
              </header>
              <div onClick={() => setIsOpen(false)}
                className="flex flex-1 flex-col gap-4 p-4 relative">{children}</div>
              <Analytics />
            </SidebarInset>
          </SidebarProvider>
          <Toaster position="top-left" reverseOrder={false} />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
