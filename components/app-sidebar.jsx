"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trpc } from "@/hooks/trpc";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  SidebarTrigger
} from "@/components/ui/sidebar";

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
    <Sidebar side="left" {...props}>
      <SidebarHeader>
        <SidebarTrigger className="-ml-1" />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}{" "}
                  <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
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
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
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
            <Button
              variant="vancy"
              className="w-full rounded-none font-sm"
              onClick={handleLogin}
            >
              Login
            </Button>
          )}
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
