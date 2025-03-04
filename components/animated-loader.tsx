import React from 'react';
import LogoSvg from "@/components/logo-svg";
import { LoaderCircle } from 'lucide-react';

export default function AnimatedLoader() {
  return (
    <div className="h-[100svh] bg-background relative">
      <div className="fixed inset-0 flex items-center justify-center">
        <LogoSvg fill="currentColor" className="h-16 w-16" />
      </div>
      <div className="absolute bottom-4 left-4">
        <div className="flex items-center gap-2">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    </div>
  );
}
