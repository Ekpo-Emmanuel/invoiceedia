import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
        <header className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 my-6">
            <div className="flex items-center justify-between">  
                <p className="text-sm">Invoicedia &copy; {new Date().getFullYear()} - Created by <b><Link href="https://github.com/Ekpo-Emmanuel" target="_blank">Emmanuel Ekpo</Link></b></p>
            </div>
        </header>
  );
}
