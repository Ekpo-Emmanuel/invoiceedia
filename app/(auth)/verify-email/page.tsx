'use client';

import { useSignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft } from 'lucide-react';
import LogoSvg from "@/components/logo-svg";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (isLoaded && !email) {
      router.replace('/sign-up');
    }
  }, [isLoaded, email, router]);

  // Request new verification code
  const handleResendCode = async () => {
    if (!isLoaded || !signUp) return;

    try {
      setIsLoading(true);
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast.success("New verification code sent");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    try {
      setIsLoading(true);
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
        toast.success("Email verified successfully!");
      } else {
        toast.error("Verification failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Failed to verify email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4 px-4 lg:px-8 pt-8 pb-4">
      <Link href="/sign-up" className="flex items-center gap-2 text-sm font-medium lg:font-bold text-muted-foreground">
        <ChevronLeft className="h-4 w-4" />
        <span>Sign up</span>
      </Link>

      <div className="flex items-center justify-center mt-6">
        <div className="w-full space-y-8 max-w-md">
          <div>
            <LogoSvg fill="currentColor" className="h-8 w-8" />
            <div className="mt-6 flex items-center gap-2">
              <h2 className="text-xl tracking-[-0.16px] text-slate-12 font-bold">
                Check your email
              </h2>
            </div>
            <p className="text-muted-foreground mt-2">
              We've sent a verification code to {email}
            </p>
          </div>

          <form onSubmit={handleVerification} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-muted-foreground">Verification code</Label>
              <Input 
                id="code"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="border dark:bg-muted/30 text-card-foreground bg-muted/50 dark:border-primary/10 placeholder:font-medium"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify email"}
            </Button>
          </form>

          <div className="">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="font-medium text-blue-500 hover:text-primary/90"
              >
                Click to resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
