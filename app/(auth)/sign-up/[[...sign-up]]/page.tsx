'use client';

import { useSignUp } from "@clerk/nextjs";
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

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Handle email sign up
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded || !signUp) return;
    
    try {
      setIsLoading(true);
      
      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      });
      
      // Start the email verification process
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      // Use replace instead of push to avoid the redirect issue
      router.replace(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      toast.success("Verification code sent to your email");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle OAuth sign up
  const handleOAuthSignUp = async (provider: "oauth_google" | "oauth_microsoft") => {
    if (!isLoaded || !signUp) return;
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || `Failed to sign up with ${provider}`);
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
              Create an Invoicepedia account
            </h2>
            <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-medium text-blue-500 hover:text-primary/90">
                  Log in
                </Link>
            </p>
          </div>

          <div>
            <form onSubmit={handleEmailSignUp} className="space-y-4 ">
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
                <Label htmlFor="password" className="text-muted-foreground">Password</Label>
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
              
              {/* Add CAPTCHA Widget before the submit button */}
              <div id="clerk-captcha" className="" />
              
              <div>
                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </div>
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
                onClick={() => handleOAuthSignUp("oauth_google")}
                disabled={isLoading}
              >
                <FcGoogle className="h-4 w-4" />
                Sign up with Google
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center text-muted-foreground justify-center gap-2 border dark:bg-muted/30 text-sm font-medium bg-muted/50 dark:border-primary/10"
                onClick={() => handleOAuthSignUp("oauth_microsoft")}
                disabled={isLoading}
              >
                <FaMicrosoft className="h-4 w-4 text-blue-500" />
                Sign up with Microsoft
              </Button>
            </div>
            <div className="text-[11px] text-muted-foreground mt-8">
              By Signing up, you agree to our <Link href="#terms" className="font-medium text-blue-500 hover:text-primary/90">Terms of Service</Link> and <Link href="#privacy-policy" className="font-medium text-blue-500 hover:text-primary/90">Privacy Policy </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
