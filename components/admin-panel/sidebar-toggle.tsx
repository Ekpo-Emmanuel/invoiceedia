import { ArrowRightFromLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarToggleProps {
  isOpen: boolean | undefined;
  setIsOpen?: () => void;
}

export function SidebarToggle({ isOpen, setIsOpen }: SidebarToggleProps) {
  return (
    <div className="">
      <div
        onClick={() => setIsOpen?.()}
        className={cn(
          "rounded-full text-primary bg-primary/5 dark:bg-primary/10 w-10 h-10 flex items-center justify-center cursor-pointer",
          isOpen && "bg-transparent w-6 h-6"
        )}
      >
        <ArrowRightFromLine
          strokeWidth={2.3}
          className={cn(
            "h-5 w-5 transition-transform ease-in-out duration-700",
            isOpen === false ? "rotate-0" : "rotate-180"
          )}
        />
      </div>
    </div>
  );
}