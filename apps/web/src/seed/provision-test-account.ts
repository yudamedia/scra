import { getPayload } from "payload"
import config from "@payload-config"
import { auth } from "../lib/auth"

const MEMBERSHIP_NUMBER = "466"
const EMAIL = "yudamedia@gmail.com"

async function run() {
  const payload = await getPayload({ config })
  console.log("Payload initialized.")

  const { docs } = await payload.find({
    collection: "memberships",
    where: { membershipNumber: { equals: MEMBERSHIP_NUMBER } },
    limit: 1,
  })
  const membership = docs[0]
  if (!membership) throw new Error(`Membership ${MEMBERSHIP_NUMBER} not found`)

  const alreadyLinked = (membership.linkedAuthUsers ?? []).some((u) => u.email === EMAIL)
  if (alreadyLinked) {
    console.log(`Membership ${MEMBERSHIP_NUMBER} already has a linked portal account for ${EMAIL}.`)
    return
  }

  const created = await auth.api.createUser({
    body: {
      email: EMAIL,
      name: `${membership.primaryContact.firstName ?? ""} ${membership.primaryContact.surname}`.trim(),
    },
  })

  await payload.update({
    collection: "memberships",
    id: membership.id,
    data: {
      linkedAuthUsers: [...(membership.linkedAuthUsers ?? []), { authUserId: created.user.id, email: EMAIL }],
    },
  })

  console.log(`Provisioned portal account ${created.user.id} for ${EMAIL}, linked to membership ${MEMBERSHIP_NUMBER}.`)
}

try {
  await run()
} catch (err) {
  console.error("Provisioning script failed:", err)
  process.exitCode = 1
}
