"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Dot, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

interface CollapseMenuButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  submenus: Submenu[];
  isOpen: boolean | undefined;
}

export function CollapseMenuButton({
  icon: Icon,
  label,
  active,
  submenus,
  isOpen
}: CollapseMenuButtonProps) {
  const pathname = usePathname();
  const isSubmenuActive = submenus.some((submenu) =>
    submenu.active === undefined ? submenu.href === pathname : submenu.active
  );
  const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

  return isOpen ? (
    <Collapsible
      open={isCollapsed}
      onOpenChange={setIsCollapsed}
      className="w-full"
    >
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 "
        asChild
      >
        <div
          // variant={isSubmenuActive ? "secondary" : "ghost"}
          className={cn(
            "rounded items-center p-4 hover:bg-primary/5 w-full h-10 flex justify-between gap-2 cursor-pointer",
          )}
        >

          <div className="flex items-center">
            <div 
              className={cn(
                "flex items-center gap-2",
                !isOpen ? 'justify-center' : 'justify-start'
              )}
            >
              <Icon size={18} strokeWidth={2.5}/>
              <span
                className={cn(
                  "max-w-[150px] text-sm font-semibold",
                  !isOpen
                    ? "hidden"
                    : "inline"
                )}
              >
                {label}
              </span>
            </div>
          </div>
          {isOpen && (
            <div>
              <ChevronDown
                size={18}
                className="transition-transform duration-200"
              />
            </div>
          )}
        </div>

      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {submenus.map(({ href, label, active }, index) => (
          <div
            key={index}
            // variant={
            //   (active === undefined && pathname === href) || active
            //     ? "secondary"
            //     : "ghost"
            // }
            className="rounded items-center flex p-4 hover:bg-primary/5 w-full justify-start h-10 mb-1 cursor-pointer"
          >
            <Link 
              href={href}
              className="flex items-center "
            >
              <span className="mr-4 ml-2">
                <Dot size={18} /> 
              </span>
              <p
                className={cn(
                  "max-w-[170px] truncate text-sm font-semibold",
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-96 opacity-0"
                )}
              >
                {label}
              </p>
            </Link>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ) : (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <div
                // variant={isSubmenuActive ? "secondary" : "ghost"}
                className={cn(
                  "rounded items-center p-4 hover:bg-primary/5 w-full h-10 flex gap-2 cursor-pointer",
                  isOpen === false ? 'justify-center' : 'justify-start'
                )}
              >
                <Icon size={18} strokeWidth={2.5}/>
                <span 
                    className={cn(
                      "text-sm font-semibold",
                      isOpen === false
                        ? "hidden"
                        : "inline"
                    )}
                  >
                  {label}
                  </span>
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent className="translate-x-2 translate-y-2" side="right" align="start" alignOffset={2}>
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent className="w-56 -translate-x-4" side="right" sideOffset={25} align="start">
        <DropdownMenuLabel className="max-w-[190px] truncate">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {submenus.map(({ href, label, active }, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link
              className={`cursor-pointer ${
                ((active === undefined && pathname === href) || active) &&
                "bg-secondary"
              }`}
              href={href}
            >
              <p className="max-w-[180px] truncate">{label}</p>
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuArrow className="fill-border" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}