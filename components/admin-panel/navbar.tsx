import Link from "next/link";
import ModeToggle from "../mode-toggle";
import { UserNav } from "./user-nav";
import { SheetMenu } from "./sheet-menu";
import V2LogoSvg from "../v2/v2-logo";

interface NavbarProps {
  title: string;
  icon?: React.ElementType;
  breadcrumbs?: { label: string; href: string }[];
}

export function Navbar({ title, icon: Icon, breadcrumbs }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background border-b dark:border-primary/10">
      <div className="sm:mx-8 flex h-14 md:h-12 items-center px-4 lg:px-0">
        <div className="flex items-center space-x-2">
          {Icon && <Icon size={14} strokeWidth={1.5}/>} 
          <h1 className="font-bold">{title}</h1>
          {/* {Icon ? <Icon size={14} strokeWidth={1.5}/> : <V2LogoSvg />}  */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  <Link 
                    href={crumb.href}
                    className="hover:text-gray-900"
                  >
                    {crumb.label.length > 15 
                      ? `${crumb.label.slice(0, 15)}...` 
                      : crumb.label}
                  </Link>
                </div>
              ))}
            </div>
          )}
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
