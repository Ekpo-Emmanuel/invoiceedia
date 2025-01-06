"use client";
import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import { ChevronDown, PanelsTopLeft, LogOut } from "lucide-react";
import Link from "next/link";
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "../ui/sidebar";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import LogoSvg from "../logo-svg";

export function Sidebar() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-[100svh] bg-muted dark:border-primary/10 border-r -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        !getOpenState() ? "w-[90px]" : "w-72",
        settings.disabled && "hidden"
      )}
    >
      {isOpen && 
        <div className="fixed top-4 right-[2px] z-10 hidden scale-75 sm:inline">
          <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
        </div>
      }
        
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(true)}
        className="relative h-full flex flex-col overflow-y-auto"
      >
        <div
          className={cn(
            "transition-transform ease-in-out duration-300 p-2",
          )}
        >
          <Link 
            href="/" 
            className={cn(
              "rounded items-center p-4 w-full h-10 flex text-primary/80 gap-2",
              !getOpenState() ? "justify-center" : "justify-start"
            )}
          >
            <div>
              <LogoSvg className="fill-primary/80"/>
            </div>
            <h1
              className={cn(
                "font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300",
                !getOpenState()
                  ? "hidden"
                  : "inline"
              )}
            >
              Invoicedia
            </h1>
          </Link>
        </div>

          <Menu isOpen={getOpenState()} />
        <div className="bg-muted/10">
        </div>
      </div>
      <SidebarFooter className="fixed bottom-0 left-0 w-full bg-muted">
        <SidebarMenu className="grid grid-cols-1 gap-4">
          {!isOpen && 
            <SidebarMenuItem className="flex items-center justify-center">
              <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger>
                    <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
                  </TooltipTrigger>
                  <TooltipContent className="translate-x-6" side="right">Expand</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          }
          {!isOpen && <hr className="border-t-1 border-primary/10 w-1/2 mx-auto" />}
          <SidebarMenuItem className="">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    className="w-full justify-center h-10"
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent className="translate-x-6" side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </aside>
  );
}