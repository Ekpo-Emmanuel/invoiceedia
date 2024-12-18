import React from "react";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
        <header className="max-w-7xl w-full mx-auto px-4 mt-6 mb-12">
            <div className="flex items-center justify-between">  
                <p className="font-bold">
                    <Link href="/">Invoicedia</Link>
                </p>
                <div>
                    <SignedOut>
                    <Button asChild variant={"outline"}>
                        <SignInButton />
                    </Button>
                    </SignedOut>
                    <SignedIn>
                    <UserButton />
                    </SignedIn>
                </div>
            </div>
        </header>
  );
}
