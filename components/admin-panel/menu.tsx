"use client";

import Link from "next/link";
import { Ellipsis } from "lucide-react";
import { usePathname, useRouter, useParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { getMenuList } from "@/lib/menu-list";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollapseMenuButton } from "./collapse-menu-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const params = useParams<{ organizationSlug: string }>();
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  const isActiveLink = (href: string) => {
    const fullPath = `/${params.organizationSlug}${href}`;
    const isExactMatch = pathname === fullPath;
    const isHomeMatch = href === '/' && pathname === `/${params.organizationSlug}`;
  
    if (isExactMatch || isHomeMatch) {
      return "text-blue-500 dark:text-blue-400 font-normal before:content-[''] before:absolute before:h-1/2 before:rounded-full before:w-[3px] before:bg-blue-500 before:dark:bg-blue-400 before:top-1/2 before:-translate-y-1/2 before:right-0";
    }
    return '';
  };
  

  return (
    <ScrollArea className="w-full">
      <nav className="mt-8 w-full text-primary/60 dark:text-primary/50">
        <ul className="flex flex-col items-start px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium py-2 px-4 max-w-[248px] truncate  w-full">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="translate-x-2">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}

              {menus.map(({ href, label, icon: Icon, active, submenus }, index) => {
                return !submenus || submenus.length === 0 ? (
                  <div key={index}>
                    <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Link 
                              href={`/${params.organizationSlug}${href}`}
                            >
                            <div
                              className={cn(
                                "rounded items-center p-4 w-full h-10 flex gap-2 hover:bg-primary/5 mb-1 relative",
                                isOpen === false ? 'justify-center' : 'justify-start',
                                isActiveLink(href)
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
                            </Link>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right" className="translate-x-2">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                  </div>
                ) : (
                  <div key={index}>
                    <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={
                          active === undefined
                            ? pathname.startsWith(href)
                            : active
                        }
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}