import { redirect } from "next/navigation";

import { getPortalSession } from "@/lib/portal";

export default async function PortalAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = await getPortalSession();
  if (!session) redirect("/portal/login");

  return <>{children}</>;
}
