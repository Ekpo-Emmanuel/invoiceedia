'use client';

import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import LogoSvg from "@/components/logo-svg";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Request password reset code
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: formData.email,
      });
      setSuccessfulCreation(true);
      toast.success("Reset code sent to your email");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setIsLoading(true);
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: formData.code,
        password: formData.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
        toast.success("Password reset successfully!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="flex flex-col gap-4 px-4 lg:px-8 pt-8 pb-4">
      <Link href="/sign-in" className="flex items-center gap-2 text-sm font-medium lg:font-bold text-muted-foreground">
        <ChevronLeft className="h-4 w-4" />
        <span>Sign in</span>
      </Link>

      <div className="flex items-center justify-center mt-6">
        <div className="w-full space-y-8 max-w-md">
          <div>
            <LogoSvg fill="currentColor" className="h-8 w-8" />
            <h2 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mt-6">
              {!successfulCreation ? 'Reset your password' : 'Check your email'}
            </h2>
            <p className="text-muted-foreground">
              {!successfulCreation 
                ? "Enter your email address and we'll send you a reset link" 
                : `Enter the verification code sent to ${formData.email}`}
            </p>
          </div>

          <div>
            {!successfulCreation ? (
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground">Email address</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border dark:bg-muted/30 text-card-foreground bg-muted/50 dark:border-primary/10 placeholder:font-medium"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send reset instructions"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-muted-foreground">Verification code</Label>
                  <Input 
                    id="code"
                    name="code"
                    placeholder="Enter code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="border dark:bg-muted/30 text-card-foreground bg-muted/50 dark:border-primary/10 placeholder:font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-muted-foreground">New password</Label>
                  <div className="relative">
                    <Input 
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="border dark:bg-muted/30 text-card-foreground bg-muted/50 dark:border-primary/10 placeholder:font-medium pr-10"
                    />
                    {formData.password && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting..." : "Reset password"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
