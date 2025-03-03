import React from "react";
import ModeToggle from "@/components/mode-toggle";
import V2LogoSvg from "../v2-logo";


export default function OrganizationHeader() {
  return (
    <header className="fixed top-0 w-full z-50 bg-background">
        <div className="flex items-center justify-between border-b px-4 md:px-0 py-2 container mx-auto">
            <V2LogoSvg />
            <ModeToggle />
        </div>
    </header>
  );
}
