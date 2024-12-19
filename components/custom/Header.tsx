import React from "react";
import { Button } from "@/components/ui/button";
import {
    OrganizationSwitcher,
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
                <div className="flex items-center gap-4">
                    <p className="font-bold">
                        <Link href="/dashboard">Invoicedia</Link>
                    </p>
                    <SignedIn>
                        <span className="text-slate-300">/</span>
                    </SignedIn>
                    <SignedIn>
                        <div className="">
                            <OrganizationSwitcher 
                                afterCreateOrganizationUrl={"/dashboard"}
                            />
                        </div>
                    </SignedIn>
                </div>
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
