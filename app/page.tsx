import Link from "next/link";
import { Button } from "@/components/ui/button"
import {sql} from "drizzle-orm"
import {db} from "@/db"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import LandingPage from "@/components/custom/Landing page/Container";

export default async function Home() {
  return (
    <>
      {/* <div className="h-screen w-full flex flex-col items-center justify-center">
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/dashboard">Get started</Link>
          </Button>
          <SignedOut>
            <Button asChild variant={"outline"}>
              <SignInButton />
            </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>
      </div> */}
      <div className="">
        <LandingPage />
      </div>
    </>
  );
}
