import { Button } from "@/components/ui/button"
import { Plus} from 'lucide-react'
import Link from "next/link";

interface HeaderProps {
  hasClients?: boolean;
  title: string;
}

export default function ClientPageHeader({ title }: HeaderProps) {
    return (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold ">Clients</h1>
              <p className="text-sm">Organize and manage your clients</p>
            </div>
              <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                <Link href={`/${title.toLowerCase()}/new`} passHref>
                  <Button className="w-full sm:w-auto" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Client
                  </Button>
                </Link>
              </div>
          </div>
        </div>
      )
}
