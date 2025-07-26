"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { trpc } from "@/hooks/trpc";

const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "CatShop",
      url: "#",
      items: [
        { title: "Dashboard", url: "/" },
        { title: "Order History", url: "/order" },
      ],
    },
    {
      title: "Category",
      url: "#",
      items: [
        { title: "Clothes", url: "/category/baju" },
        { title: "Shoes", url: "/category/sepatu" },
        { title: "Hat", url: "/category/topi" },
        
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const { data: user } = trpc.auth.getUser.useQuery();
  const handleLogout = () => {
    router.push("/api/logout");
  };
  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <Sidebar side="" variant="floating" {...props}>
      <SidebarHeader>
        <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>{item.title}</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {user?.role === "ADMIN" && (
          <div className="px-2 mb-2">
            <Button
              variant="vancy"
              className="w-full rounded-none"
              onClick={() => router.push("/addProduct")}
            >
              Add Product
            </Button>
          </div>
        )}
        <div className="px-2 mb-2">
          {user ? (
            
            <Button
              variant="vancy"
              className="w-full hover:bg-red-800 rounded-none"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button variant="vancy" className="w-full rounded-none font-sm" onClick={handleLogin}>
              Login
            </Button>
          )}
        </div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
