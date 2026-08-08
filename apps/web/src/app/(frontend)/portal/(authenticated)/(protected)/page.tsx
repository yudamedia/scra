import { getPortalSession } from "@/lib/portal";

export default async function PortalDashboardPage() {
  const { membership } = await getPortalSession();

  return (
    <section className="py-16">
      <div className="mx-auto w-[min(1280px,92%)]">
        <h1 className="mb-2">Welcome back{membership?.primaryContact?.firstName ? `, ${membership.primaryContact.firstName}` : ""}</h1>
        <p className="text-muted-foreground mb-10">
          Your SCRA membership is active. Members-only resources and issue tracking land here in a
          future update.
        </p>
        <div className="bg-card rounded-lg shadow-sm p-6 max-w-md">
          <h2 className="text-primary text-lg mb-4">Membership Summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Membership No.</dt>
              <dd className="text-foreground font-medium">{membership?.membershipNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Type</dt>
              <dd className="text-foreground font-medium capitalize">{membership?.type}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Expires</dt>
              <dd className="text-foreground font-medium">
                {membership?.expiryDate &&
                  new Date(membership.expiryDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
