import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2, Mail, Phone, MapPinHouse, Dot } from "lucide-react";

interface ClientPreviewProps {
  clientData: {
    firstName: string;
    lastName: string;
    companyName?: string;
    email?: string;
    phone?: string;
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    notes?: string;
  };
}

export function ClientPreview({ clientData }: ClientPreviewProps) {
  const fullName = `${clientData.firstName} ${clientData.lastName}`.trim();
  const initials =
    `${clientData.firstName[0]}${clientData.lastName[0]}`.toUpperCase();

  return (
    <div className="w-full sticky top-20 z-10">
      <div>
        <div className="flex items-center justify-between">
          {/* <span>Client Preview</span> */}
          <div className="inline-flex items-center rounded-md cursor-default pr-2.5 py-0.5 text-xs font-semibold transition-colors bg-green-100 text-green-700 dark:bg-green-900  dark:text-green-400">
            <Dot className="text-green-500 " /> Preview
          </div>
        </div>
      </div>
      <div className="space-y-6 mt-8">
        <div className="space-y-2">
          <Avatar className="w-10 h-10 rounded-lg">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold leading-none">
              {fullName || ""}
            </h3>
            <p className="text-muted-foreground text-sm flex items-center leading-none">
              <Building2 className="w-4 h-4 mr-2" />
              {clientData.companyName || "N/A"}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">Details:</p>
          <div className="grid grid-cols-1">
            <InfoItem icon={Mail} label="Email" value={clientData.email} />
            <InfoItem icon={Phone} label="Phone" value={clientData.phone} />
            <InfoItem
              icon={MapPinHouse}
              label="Address"
              value={[
                clientData.street,
                clientData.city,
                clientData.state,
                clientData.zip,
                clientData.country,
              ]
                .filter(Boolean)
                .join(", ")}
            />
            <InfoItem icon={Phone} label="Notes" value={clientData.notes} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value?: string;
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="space-x-2 py-3 border-b last:border-b-0 dark:border-primary/10 w-full">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm  opacity-50 capitalize">{label}</p>
        <p className="text-sm font-medium max-w-[20rem] overflow-hidden">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}
