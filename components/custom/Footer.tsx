import React from "react";

export default function Footer() {
  return (
        <header className="max-w-7xl mx-auto px-4 mt-6 mb-6">
            <div className="flex items-center justify-between">  
                <p className="text-sm">Invoicedia &copy; {new Date().getFullYear()} - Created by <b>Emmanuel Ekpo</b></p>
            </div>
        </header>
  );
}
