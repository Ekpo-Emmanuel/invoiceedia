
import { auth } from "@clerk/nextjs/server";
import ClientRedirectHandler from "./ClientRedirectHandler";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  return <ClientRedirectHandler />;
}
