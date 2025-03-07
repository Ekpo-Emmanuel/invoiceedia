"use client";

import { SidebarProvider } from '@/components/ui/sidebar';
import { OrganizationProvider } from '@/contexts/organization-context';
import { Sidebar } from "@/components/admin-panel/sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { clsx } from "clsx";

interface ClientLayoutProps {
  children: React.ReactNode;
  organizationId: string;
}

export default function ClientLayout({ children, organizationId }: Readonly<ClientLayoutProps>) {
  const sidebar = useStore(useSidebar, (x) => x);

  if (!sidebar) return null;

  const { getOpenState, settings } = sidebar;
  return (
    <OrganizationProvider organizationId={organizationId}>
      <SidebarProvider>
        <Sidebar />
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
    </OrganizationProvider>
  );
}