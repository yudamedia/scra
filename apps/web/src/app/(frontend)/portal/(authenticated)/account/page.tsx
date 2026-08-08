import { getPortalSession } from "@/lib/portal";
import { isMembershipActive } from "@/lib/memberships";
import { membershipTypeLabels } from "@/lib/format";

export default async function PortalAccountPage() {
  const { session, membership } = await getPortalSession();
  const active = membership ? isMembershipActive(membership) : false;

  return (
    <section className="py-16">
      <div className="mx-auto w-[min(720px,92%)]">
        <h1 className="mb-8">My Account</h1>

        {!membership ? (
          <div className="bg-card rounded-lg shadow-sm p-6">
            <p className="text-muted-foreground">
              We couldn&apos;t find a membership record linked to {session?.user.email}. Contact the
              secretariat if you believe this is an error.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-primary text-lg">Membership Status</h2>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-pill ${
                    active ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {active ? "Active" : "Expired"}
                </span>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Membership No.</dt>
                  <dd className="text-foreground font-medium">{membership.membershipNumber}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="text-foreground font-medium">
                    {membershipTypeLabels[membership.type] ?? membership.type}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Expiry Date</dt>
                  <dd className="text-foreground font-medium">
                    {new Date(membership.expiryDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Signed in as</dt>
                  <dd className="text-foreground font-medium">{session?.user.email}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-primary text-lg mb-4">Primary Contact</h2>
              <p className="text-foreground text-sm">
                {membership.primaryContact?.firstName} {membership.primaryContact?.surname}
              </p>
              <p className="text-muted-foreground text-sm">{membership.primaryContact?.phone}</p>
            </div>

            {!active && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-6">
                <p className="text-sm text-foreground mb-3">
                  Your membership has expired. Renew to regain access to members-only resources.
                </p>
                <a
                  href="/portal/renew"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-white font-semibold text-sm px-5 py-2.5 hover:bg-primary-dark transition-colors"
                >
                  Renew Membership
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
