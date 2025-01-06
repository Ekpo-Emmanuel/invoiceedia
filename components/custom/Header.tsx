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
import LogoSvg from "@/components/logo-svg";


export default function Header() {
  return (
    <>
        <div className="bg-blue-500 text-xs font-medium text-white text-center p-2">
            We're building something great! Have feedback? Let us know.
        </div>
        <header className="max-w-7xl w-full mx-auto px-4 md:px-6 lg:px-8 mt-6 mb-12">
            <div className="flex items-center justify-between">  
                <div className="flex items-center gap-4">
                    <p className="font-bold flex items-center gap-2">
                        <LogoSvg fill="currentColor"/>
                        <Link href="/">Invoicedia</Link>
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
                <div className="flex items-center gap-4">
                    <SignedOut>
                        <Button asChild variant={"ghost"}>
                            <SignInButton />
                        </Button>
                        <Button asChild>
                            <Link href="/sign-up">Get Started</Link>
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <UserButton />
                        <Button asChild>
                            <Link href="/dashboard">Enter Dashboard</Link>
                        </Button>
                    </SignedIn>
                </div>
            </div>
        </header>
    </>
  );
}
