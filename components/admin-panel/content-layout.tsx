import { Navbar } from "./navbar";

interface ContentLayoutProps {
  title: string;
  icon?: React.ElementType; 
  children: React.ReactNode;
}

export function ContentLayout({ title, icon, children }: ContentLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title={title} icon={icon} />
      <div className="flex-1 container max-w-6xl mx-auto w-full pt-8 pb-8 px-4 sm:px-8">
        {children}
      </div>
    </div>
  );
}
