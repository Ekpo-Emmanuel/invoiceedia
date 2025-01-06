"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Plus,
  ChevronRight,
  ChevronLeft,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ChooseOrganization() {
  const router = useRouter();
  const { isLoaded, userMemberships } = useOrganizationList({
    userMemberships: true,
  });

  const organizations = userMemberships?.data || [];
  console.log(organizations[0]?.organization?.slug);

  const getCompactRelativeTime = (createdAt: string | Date): string => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInMs = now.getTime() - createdDate.getTime();

    const minutes = Math.floor(diffInMs / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return `${days}d ago`;
  };

  if (!isLoaded) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-4 py-24">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Choose organization</h1>
          <Skeleton className="h-10 w-[140px]" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[72px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:px-0">
      <div className="flex justify-between items-center pt-12 pb-2 sticky top-12 bg-background">
        <h1 className="text-xl font-semibold">Choose organization</h1>
        {organizations?.length > 0 && (
          <div className="flex gap-1 items-center">
            <Button asChild size="icon" className="sm:hidden">
              <Link href="/create-organization">
                <Plus className="w-4 h-4" />
              </Link>
            </Button>
            <Button asChild className="hidden sm:flex">
              <Link href="/create-organization">
                Add new
                <Plus className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className="pb-20 pt-12">
        {organizations?.length === 0 ? (
          <Card className="rounded-lg overflow-hidden">
            <CardContent className="flex flex-col items-center justify-center py-8 text-center bg-background dark:border-primary/10">
              <Building2 className="h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No organizations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first organization to get started
              </p>
              <Button asChild size="sm" className="bg-blue-500 text-white">
                <Link href="/create-organization">
                  <Plus className="w-4 h-4 mr-2" />
                  Create organization
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {organizations
              .slice()
              .reverse()
              .map((org) => (
                <Card key={org.id} className="w-full max-w-2xl bg-muted/50 hover:bg-background dark:border-primary/10">
                    <Link href={`/${org?.organization?.slug}`}>
                        <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                            <div className="flex items-center gap-3">
                            <div className="bg-primary text-muted w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                                N
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg">
                                {org.organization.name}
                                </h2>
                                <p className="text-sm text-muted-foreground leading-[10px]">
                                {org.organization.slug}
                                </p>
                            </div>
                            </div>
                            <div className="flex gap-2">
                            <button className="hover:bg-accent p-1 rounded-md">
                                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                            </button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                            {" "}
                            {org.role.split(":")[1]}
                            </code>
                            <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {getCompactRelativeTime(org.organization.createdAt)}
                            </p>
                            <button className="hover:bg-accent p-1 rounded-md">
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </button>
                            </div>
                        </CardContent>
                    </Link>
                </Card>
              ))}
            {/* <div className="bg-background fixed bottom-0 left-0 w-full border-t">
              <div className="flex justify-between items-center w-full p-4 lg:px-0 container mx-auto">
                <Button disabled size="sm">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Prev
                </Button>

                <Button disabled size="sm">
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" strokeWidth={2} />
                </Button>
              </div>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}
