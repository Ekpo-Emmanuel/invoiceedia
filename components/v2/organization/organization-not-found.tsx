"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, BriefcaseBusiness } from "lucide-react";
import LogoSvg from "@/components/logo-svg";

export default function OrganizationNotFound() {
  return (
    <div className="h-[100svh] flex items-center justify-center p-4">
      <div>
        <Card className="w-full w-lg max-w-lg border-b-0 rounded-b-none bg-background">
          <CardHeader>
            <LogoSvg fill="currentColor" className="size-16 mb-5" />
            <CardTitle className="text-xl font-bold tracking-tight">
              Oops! Page Not Found
            </CardTitle>
            <p className=" mb-6 tracking-tight text-sm">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" asChild>
                <Link href="/create-organization">
                  <BriefcaseBusiness className="mr-2 h-4 w-4" /> Create an
                  organization
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            If you think this is a mistake, please contact support.
          </CardFooter>
        </Card>
        <div className="bg-blue-500/10 px-4 py-3 flex items-center justify-end rounded-b-lg">
          <div className="flex gap-2 items-center opacity-50">
            <LogoSvg fill="currentColor" />
            <span className="text-sm font-semibold">Invoicedia</span>
          </div>
        </div>
      </div>
    </div>
  );
}
