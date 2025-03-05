'use client';

import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';
import LogoSvg from "@/components/logo-svg";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    try {
      setIsLoading(true);
      
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });
      
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
        toast.success("Signed in successfully!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOAuthSignIn = async (provider: "oauth_google" | "oauth_microsoft") => {
    if (!isLoaded) return;
    
    try {
      const result = await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || `Failed to sign in with ${provider}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="flex flex-col gap-4 px-4 lg:px-8 pt-8 pb-4">
      <Link href="/" className="flex items-center gap-2 text-sm font-medium lg:font-bold text-muted-foreground">
        <ChevronLeft className="h-4 w-4" />
        <span>Home</span>
      </Link>
      <div className="flex items-center justify-center mt-6">
        <div className="w-full space-y-8 max-w-md">
          <div className="">
            <LogoSvg fill="currentColor" className="h-8 w-8" />
            <h2 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mt-6">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/sign-up" className="font-medium text-blue-500 hover:text-primary/90">
                Sign up
              </Link>
            </p>
          </div>

          <div>
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  placeholder="name@example.com" 
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border dark:bg-muted/30 text-card-foreground bg-muted/50 dark:border-primary/10 placeholder:font-medium"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-primary/90">
                    Forgot your password?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password"
                    name="password"
                    placeholder="••••••••••••"
                    type={showPassword ? "text" : "password"}
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
              <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-2 text-muted-foreground">OR</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-3 lg:gap-4">
              <Button 
                variant="outline" 
                className="flex items-center text-muted-foreground justify-center gap-2 border dark:bg-muted/30 text-sm font-medium bg-muted/50 dark:border-primary/10"
                onClick={() => handleOAuthSignIn("oauth_google")}
                disabled={isLoading}
              >
                <FcGoogle className="h-4 w-4" />
                Sign in with Google
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center text-muted-foreground justify-center gap-2 border dark:bg-muted/30 text-sm font-medium bg-muted/50 dark:border-primary/10"
                onClick={() => handleOAuthSignIn("oauth_microsoft")}
                disabled={isLoading}
              >
                <FaMicrosoft className="h-4 w-4 text-blue-500" />
                Sign in with Microsoft
              </Button>
            </div>

            <div className="text-[11px] text-muted-foreground mt-8">
              By Signing in, you agree to our <Link href="#terms" className="font-medium text-blue-500 hover:text-primary/90">Terms of Service</Link> and <Link href="#privacy-policy" className="font-medium text-blue-500 hover:text-primary/90">Privacy Policy </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
