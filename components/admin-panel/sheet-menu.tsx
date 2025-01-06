import Link from "next/link";
import { MenuIcon, Tally2, AlignJustify } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "@/components/admin-panel/menu";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import LogoSvg from "../logo-svg";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <AlignJustify size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 bg-muted dark:border-primary/10 border-r w-[70%] sm:w-72 h-full flex flex-col" side="left">
      <div
          className={cn(
            "transition-transform ease-in-out duration-300 py-2",
          )}
        >
          <Link 
            href="/" 
            className={cn(
              "rounded items-center p-4 w-full h-10 flex text-primary/80 gap-2",
            )}
          >
            <div>
              <LogoSvg className="fill-primary/80"/>
            </div>
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
              )}
            >
              Invoicedia
            </h1>
          </Link>
        </div>

        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}
