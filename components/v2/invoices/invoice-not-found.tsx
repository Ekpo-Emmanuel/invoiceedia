import { FileX } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InvoiceNotFound() {
  return (
    <div className="flex h-[100svh] shrink-0 items-center justify-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <FileX className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">Invoice not found</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          The invoice you are looking for does not exist or you do not have permission to view it.
        </p>
        <Button asChild>
          <Link href="./">Go to Invoices</Link>
        </Button>
      </div>
    </div>
  );
} 