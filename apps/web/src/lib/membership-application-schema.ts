import { z } from "zod";

export const membershipApplicationTypes = ["personal", "household", "corporate"] as const;

// Family (household) membership covers up to 2 members total (primary + 1
// additional); Corporate covers up to 4 (primary + 3 nominees).
export const maxAdditionalMembersByType: Record<(typeof membershipApplicationTypes)[number], number> = {
  personal: 0,
  household: 1,
  corporate: 3,
};

// Fields only present in the DOM conditionally (e.g. corporateBusinessName)
// come back as `null` from FormData.get() when absent, not `undefined` —
// z.string().optional() only tolerates undefined, so normalize null first.
const optionalString = z.preprocess(
  (v) => (v === null || v === undefined || v === "" ? undefined : v),
  z.string().trim().optional()
);

const additionalMemberSchema = z.object({
  surname: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  phone: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
});

export const membershipApplicationSchema = z
  .object({
    type: z.enum(membershipApplicationTypes),
    surname: z.string().trim().min(1, "Surname is required"),
    firstName: z.string().trim().min(1, "First name is required"),
    phone: z.string().trim().min(6, "Enter a valid phone number"),
    // Required here (unlike the legacy-import field, which allows a blank
    // email) — a new application always needs one to receive the portal
    // account invite once payment is confirmed.
    email: z.string().trim().email("Enter a valid email"),
    postalAddress: optionalString,
    town: optionalString,
    postalCode: optionalString,
    corporateBusinessName: optionalString,
    additionalMembers: z.array(additionalMemberSchema).max(3).optional(),
    paymentMethod: z.enum(["bank_transfer", "cash"]),
  })
  .superRefine((data, ctx) => {
    const max = maxAdditionalMembersByType[data.type];
    if ((data.additionalMembers?.length ?? 0) > max) {
      ctx.addIssue({
        code: "custom",
        path: ["additionalMembers"],
        message:
          data.type === "household"
            ? "Family membership allows at most 1 additional member."
            : `${data.type} membership allows at most ${max} additional members.`,
      });
    }
  });

export type MembershipApplicationInput = z.infer<typeof membershipApplicationSchema>;
