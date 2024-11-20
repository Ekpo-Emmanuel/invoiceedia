import Link from "next/link";
import { Button } from "@/components/ui/button"
import {sql} from "drizzle-orm"

import {db} from "@/db"

export default async function Home() {
  const result = await db.execute(sql`SELECT current_database()`);

  // console.log(result);
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/dashboard">Get started</Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
