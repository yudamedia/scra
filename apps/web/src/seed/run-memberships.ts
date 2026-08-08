import { getPayload } from 'payload'
import config from '@payload-config'
import XLSX from 'xlsx'
import path from 'path'

console.log('Membership migration seed script starting...')

const SOURCE_FILE = path.resolve(process.cwd(), 'materials/SCRA 2025 as at 16.06.2025.xlsx')
const SHEET_NAME = '2025 Members (2)'

// Duplicate source "No." collisions, resolved verbatim per CLAUDE.md's
// already-decided plan. Keyed by the exact NAMES cell text (trimmed,
// uppercased) so a record only matches its specific row, not just any row
// sharing the same colliding number.
const DEDUPE_OVERRIDES: Record<string, { newNumber: string; note: string }> = {
  'CRONCHEY CHRISTINA': {
    newNumber: '459',
    note: 'Reassigned from 308 — collided with Engels Stefan (kept 308); this side was flagged "Details update" in the source.',
  },
  'WINFRED DEBORAH': {
    newNumber: '460',
    note: 'Reassigned from 415 — collided with Khimji Shamim (kept 415); this side was flagged "Details update" in the source.',
  },
  'ASHTEL ANINAH': {
    newNumber: '461',
    note: 'Reassigned from 416 — collided with Pope Wayne (kept 416); this side was flagged "Details update" in the source.',
  },
  'VAN NIEKERK ESME': {
    newNumber: '462',
    note: 'Reassigned from 202 — collided with Matiba Susan (kept 202, first alphabetically).',
  },
  'STONE GILLIAN': {
    newNumber: '463',
    note: 'Reassigned from 342 — collided with Huth Valentina (kept 342, first alphabetically).',
  },
  'MIDI AGNES': {
    newNumber: '464',
    note: 'Reassigned from 414 — three-way collision with Genevier Chrisme (kept 414, first alphabetically) and Soprani Andrea.',
  },
  'SOPRANI ANDREA': {
    newNumber: '465',
    note: 'Reassigned from 414 — three-way collision with Genevier Chrisme (kept 414, first alphabetically) and Midi Agnes.',
  },
}

type Member = { surname: string; firstName: string; phone?: string; email?: string }

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function splitPersonName(raw: string): { surname: string; firstName: string } {
  const tokens = raw.trim().replace(/\s+/g, ' ').split(' ').filter(Boolean)
  if (tokens.length === 0) return { surname: '', firstName: '' }
  if (tokens.length === 1) return { surname: toTitleCase(tokens[0]), firstName: '' }
  const firstName = toTitleCase(tokens[tokens.length - 1])
  const surname = toTitleCase(tokens.slice(0, -1).join(' '))
  return { surname, firstName }
}

/** "COMPANY NAME (NOMINEE NAME)" -> { company: "COMPANY NAME", nominee: "NOMINEE NAME" } */
function parseParens(raw: string): { company: string; nominee: string } | null {
  const match = raw.trim().match(/^(.*?)\s*\((.*?)\)\s*$/)
  if (!match) return null
  return { company: match[1].trim(), nominee: match[2].trim() }
}

type Row = string[]

function cell(row: Row, i: number): string {
  return String(row[i] ?? '').trim()
}

const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[a-zA-Z]{2,}$/

/** Source emails occasionally have typos (e.g. a comma instead of a dot) that
 * fail the collection's email field validation — drop those into flags
 * instead of the structured field rather than failing the whole import. */
function cleanEmail(raw: string | undefined, flags: string[], who: string): string | undefined {
  if (!raw) return undefined
  if (EMAIL_RE.test(raw)) return raw
  flags.push(`Malformed email on source row for "${who}": "${raw}" — needs manual correction.`)
  return undefined
}

async function run() {
  try {
    const payload = await getPayload({ config })
    console.log('Payload initialized.')

    const workbook = XLSX.readFile(SOURCE_FILE)
    const sheet = workbook.Sheets[SHEET_NAME]
    if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" not found in ${SOURCE_FILE}`)

    const allRows: Row[] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '' })
    const dataRows = allRows.slice(2).filter((r) => r.some((c) => String(c).trim() !== ''))

    // Group into blocks: a numbered ("No.") row plus every unnumbered row
    // that immediately follows it in the source, up to the next numbered
    // row. Verified against the source: household/corporate additional
    // members are listed as unnumbered rows directly beneath their primary
    // (e.g. "BELCHER JANET TANIA" No.449 immediately followed by unnumbered
    // "BELCHER EDWIN").
    const blocks: { primary: Row; subRows: Row[] }[] = []
    for (const row of dataRows) {
      if (cell(row, 0) !== '') {
        blocks.push({ primary: row, subRows: [] })
      } else if (blocks.length > 0) {
        blocks[blocks.length - 1].subRows.push(row)
      }
    }

    console.log(`Parsed ${blocks.length} primary membership blocks from the source sheet.`)

    let created = 0
    let updated = 0
    let skipped = 0

    for (const block of blocks) {
      const { primary, subRows } = block
      const rawNumber = cell(primary, 0)
      const rawName = cell(primary, 1)
      const subscriptionRaw = cell(primary, 5)
      const amountRaw = cell(primary, 4)
      const notesRaw = cell(primary, 6)

      const flags: string[] = []

      let type: 'personal' | 'household' | 'corporate' | 'free' = 'personal'
      const subscriptionUpper = subscriptionRaw.toUpperCase()
      if (subscriptionUpper === '10000' || subscriptionUpper === '15000') type = 'corporate'
      else if (subscriptionUpper === '5000') type = 'household'
      else if (subscriptionUpper === '3000') type = 'personal'
      else if (subscriptionUpper === 'FREE') type = 'free'
      else {
        flags.push(`Ambiguous subscription tier "${subscriptionRaw}" — defaulted to personal, please verify.`)
      }

      if (amountRaw) flags.push(`Source AMOUNT column: "${amountRaw}"`)
      if (notesRaw) flags.push(`Source NOTES column: "${notesRaw}"`)

      // Build the member list: the primary row, plus any sub-rows, each
      // parsed either as a "COMPANY (NOMINEE)" pair or a bare person name.
      const parsedPrimary = parseParens(rawName)
      const companyPrefix = type === 'corporate' ? (parsedPrimary?.company ?? rawName) : null

      const members: Member[] = []
      const primaryNameForSplit = parsedPrimary ? parsedPrimary.nominee : rawName
      if (primaryNameForSplit) {
        members.push({
          ...splitPersonName(primaryNameForSplit),
          phone: cell(primary, 2) || undefined,
          email: cleanEmail(cell(primary, 3) || undefined, flags, rawName),
        })
      } else {
        flags.push('No nominee name found on the primary row — company name used as a placeholder.')
        members.push({
          surname: toTitleCase(parsedPrimary?.company ?? rawName),
          firstName: '',
          phone: cell(primary, 2) || undefined,
          email: cleanEmail(cell(primary, 3) || undefined, flags, rawName),
        })
      }

      for (const sub of subRows) {
        const subName = cell(sub, 1)
        if (!subName) continue
        const subParsed = parseParens(subName)
        const nameForSplit = subParsed ? subParsed.nominee : subName
        if (!nameForSplit) continue
        members.push({
          ...splitPersonName(nameForSplit),
          phone: cell(sub, 2) || undefined,
          email: cleanEmail(cell(sub, 3) || undefined, flags, subName),
        })
      }

      if (members.length > 4) {
        flags.push(`${members.length - 4} additional member row(s) beyond the first 4 were dropped — review source.`)
      }
      const cappedMembers = members.slice(0, 4)
      const [primaryMember, ...additionalMembers] = cappedMembers

      const override = DEDUPE_OVERRIDES[rawName.toUpperCase()]
      if (override) flags.push(override.note)
      const membershipNumber = override ? override.newNumber : rawNumber

      const subscriptionAmount = /^\d+$/.test(subscriptionRaw) ? Number(subscriptionRaw) : undefined

      const data = {
        membershipNumber,
        type,
        primaryContact: {
          surname: primaryMember.surname,
          firstName: primaryMember.firstName,
          phone: primaryMember.phone,
          email: primaryMember.email,
        },
        corporateBusinessName: type === 'corporate' ? toTitleCase(companyPrefix ?? '') : undefined,
        additionalMembers: additionalMembers.map((m) => ({
          surname: m.surname,
          firstName: m.firstName,
          phone: m.phone,
          email: m.email,
        })),
        subscriptionAmount,
        expiryDate: '2026-12-31T00:00:00.000Z',
        importStatus: 'imported' as const,
        importFlags: flags.join(' | ') || undefined,
      }

      try {
        const existing = await payload.find({
          collection: 'memberships',
          where: { membershipNumber: { equals: membershipNumber } },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          await payload.update({ collection: 'memberships', id: existing.docs[0].id, data })
          updated++
        } else {
          await payload.create({ collection: 'memberships', data })
          created++
        }
      } catch (err) {
        console.error(`Failed to upsert membership ${membershipNumber} (${rawName}):`, err)
        console.error('  data was:', JSON.stringify(data))
        skipped++
      }
    }

    console.log(
      `Seed complete. Created: ${created}, Updated: ${updated}, Skipped (errors): ${skipped}, Total blocks: ${blocks.length}.`,
    )
  } catch (err) {
    console.error('Seed script failed:', err)
    process.exitCode = 1
  }
}

await run()
