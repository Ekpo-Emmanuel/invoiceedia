"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { Sidebar } from "@/components/admin-panel/sidebar";
import { clsx } from "clsx";

import { clerkClient } from "@clerk/nextjs/server";
import { checkOrganizationExists } from '@/utils/serverUtils';
import { OrganizationContext } from '@/contexts/organization-context';
import OrganizationNotFound from "@/components/v2/organization/organization-not-found";

interface OrganisationLayoutProps {
  children: React.ReactNode;
}

export default function OrganisationLayout({ children }: Readonly<OrganisationLayoutProps>) {
  const sidebar = useStore(useSidebar, (x) => x);

  if (!sidebar) return null;

  const { getOpenState, settings } = sidebar;

  return (
    <SidebarProvider>
      <Sidebar />
      <div className="flex flex-col h-[100svh] w-full">
        <main
          className={clsx(
            "flex-grow transition-[margin-left] ease-in-out duration-300 text-primary/80",
            !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
          )}
        >
          {children}
        </main>
        <footer
          className={clsx(
            "transition-[margin-left] ease-in-out duration-300 bg-white dark:bg-gray-800",
            !settings.disabled && (!getOpenState() ? "lg:ml-[90px]" : "lg:ml-72")
          )}
        />
      </div>
    </SidebarProvider>
  );
}
