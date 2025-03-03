import ModeToggle from "../mode-toggle";
import { UserNav } from "./user-nav";
import { SheetMenu } from "./sheet-menu";
import V2LogoSvg from "../v2/v2-logo";

interface NavbarProps {
  title: string;
  icon?: React.ElementType; 
}

export function Navbar({ title, icon: Icon }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b dark:border-primary/10">
      <div className="sm:mx-8 flex h-14 md:h-12 items-center px-4 lg:px-0">
        <div className="flex items-center space-x-2">
          {Icon && <Icon size={14} strokeWidth={1.5}/>} 
          {/* {Icon ? <Icon size={14} strokeWidth={1.5}/> : <V2LogoSvg />}  */}
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 gap-2 items-center justify-end">
          <ModeToggle />
          <UserNav />
          <SheetMenu />
        </div>
      </div>
    </header>
  );
}
