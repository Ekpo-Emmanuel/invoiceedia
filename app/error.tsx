'use client';

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error }: { error: Error }) {
  return (
    <div className="flex h-[100svh] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again later."}
        </p>
        <Button asChild>
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}