import { AppSidebar } from "@/components/app-sidebar";
import PreviewProduct from "@/components/preview-product";
import add from "@/public/icon/Interface/Shopping_Cart_01.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Button
            variant="vancy"
            className="w-[4%] h-[5vh] rounded-none flex right-3 absolute"
          >
            <Image
              src={add}
              className="w-4 h-4 filter brightness-0 hover:filter-none"
              alt="star"
            />
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
