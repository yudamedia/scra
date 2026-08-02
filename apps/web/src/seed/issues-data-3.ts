export const newIssues = [
  {
    title: "Beach Road Visibility Obstruction at Lotfa Hotel Junction",
    slug: "lotfa-junction-visibility",
    category: "roads-infrastructure",
    status: "in-progress",
    area: "diani",
    background:
      "An extended built-up wall on the road reserve adjacent to Lotfa Hotel obstructs visibility for drivers approaching the Diani Beach Road junction, creating a dangerous blind spot. Over the past year, this obstruction has been a contributing factor in more than seven recorded traffic accidents at the junction.",
    actionsUndertaken:
      "SCRA wrote formally to Lotfa Hotel management requesting immediate removal or modification of the wall, copying the Kwale Governor, CEC Environment, the Kwale Physical Planner, the County Commissioner, KeRRA, and the Diani Municipality Manager.",
    progressUpdates: [
      { date: "2025-10-12", update: "The most recent of at least seven recorded accidents at the junction occurred." },
      { date: "2025-10-13", update: "SCRA issued a formal letter to Lotfa Hotel requesting urgent action." },
    ],
    supportingDocuments: ["lotfa-letter"],
  },
  {
    title: "Diani Crow Busters Initiative",
    slug: "diani-crow-busters",
    category: "environment",
    status: "in-progress",
    area: "diani",
    background:
      "The Indian house crow, an invasive species, has become a significant nuisance and ecological threat across Diani and its environs, prompting a coordinated control programme.",
    actionsUndertaken:
      "SCRA supports a dedicated Diani Crow Busters team carrying out a crow baiting and monitoring programme across Diani Municipality, working with A Rocha Kenya. Leopard Beach, Swahili Beach, and Diani Sea Resort/Lodge hotels have supported the initiative, including funding a motorbike to improve the team's mobility and coverage.",
    progressUpdates: [
      { date: "2026-06-01", update: "A new motorbike was handed over to the Diani Crow Busters team to improve mobility and coordination across the municipality." },
    ],
    supportingDocuments: ["crow-busters"],
  },
  {
    title: "Proposed Diani Beach Residences Development (L.R. No. 16289)",
    slug: "diani-beach-residences-objection",
    category: "planning-development",
    status: "in-progress",
    area: "diani",
    background:
      "A proposed mixed-use residential and hospitality development on a 5.14-hectare first-row beachfront site in Diani has raised concerns over project scope transparency, environmental impact, and strain on local infrastructure. SCRA identified a discrepancy between the 300 apartments described to local stakeholders and the 400-500 units marketed internationally by the project's operating partners.",
    actionsUndertaken:
      "SCRA submitted a formal objection and memorandum to the appointed ESIA consultant, copying the Assistant County Commissioner, NEMA, the CECM for Environment, and the Diani Municipality Board, demanding full disclosure of project scope, evidence of consultant credentials, and a downscaling of the proposal. SCRA indicated it is prepared to pursue legal recourse through the National Environment Tribunal and the Environment and Land Court if concerns are not addressed.",
    progressUpdates: [
      { date: "2026-06-26", update: "SCRA submitted its formal objection memorandum ahead of the public stakeholder consultation meeting." },
    ],
    supportingDocuments: ["beach-residences-objection"],
  },
  {
    title: "Overhead Power Lines and Billboard Safety Hazard",
    slug: "overhead-power-lines-billboards",
    category: "electricity",
    status: "in-progress",
    area: "diani",
    background:
      "Large billboards erected close to main overhead power lines along major roads in Diani encroach on Kenya Power's infrastructure wayleaves, posing a safety hazard, particularly given strong coastal winds.",
    actionsUndertaken:
      "SCRA wrote formally to Kenya Power's Diani office requesting inspection of the installations, enforcement of mandatory clearance margins, and coordination with county authorities to remove or relocate hazardous billboards.",
    progressUpdates: [
      { date: "2026-06-21", update: "A billboard banner tore loose and fell onto overhead power lines, causing a three-to-four-hour blackout and a snapped line falling onto the road." },
      { date: "2026-06-25", update: "SCRA formally wrote to Kenya Power requesting urgent inspection and enforcement." },
    ],
    supportingDocuments: ["power-lines-letter"],
  },
  {
    title: "Diani Event Planning, Regulation and the 'Destination Diani' Roundtable",
    slug: "diani-event-planning-roundtable",
    category: "planning-development",
    status: "in-progress",
    area: "diani",
    background:
      "Large, uncoordinated public events in Diani have increasingly strained local infrastructure, security resources, and residential peace, driven by a lack of timely notification, unclear accountability for noise and traffic impacts, and fragmented licensing across NEMA, Public Health, and county departments.",
    actionsUndertaken:
      "SCRA convened a multi-stakeholder roundtable at Diani Sea Resort on 21 July 2026, bringing together Diani Municipality, NEMA, the National Police Service, the Kenya Association of Hotelkeepers and Caterers, transport providers, and event hosts. Discussion covered a timely notification framework, clear accountability for sound mitigation, waste, traffic and security, and synchronized licensing. Following the roundtable, SCRA submitted a formal memorandum to the CECMs for Environment and Trade/Tourism proposing reactivation of the 'Destination Diani' forum, a one-stop licensing process, off-peak event calendar positioning, and a dedicated venue for mega-events away from central Diani.",
    progressUpdates: [
      { date: "2026-07-10", update: "SCRA issued an initial invitation proposing a roundtable discussion on event planning and shared responsibility." },
      { date: "2026-07-16", update: "SCRA confirmed finalized roundtable details: Diani Sea Resort, 9:00 AM-12:00 PM, Tuesday 21 July 2026." },
      { date: "2026-07-21", update: "The roundtable was held, bringing together residents, county officials, security leads, and hospitality stakeholders to discuss notification frameworks, accountability, and licensing synchronization." },
      { date: "2026-07-31", update: "SCRA submitted a formal memorandum proposing reactivation of the Destination Diani forum, streamlined licensing, off-peak event positioning, and a dedicated mega-event venue." },
    ],
    supportingDocuments: [
      "roundtable-invite-jul10",
      "roundtable-invite-jul16",
      "roundtable-minutes",
      "roundtable-program",
      "opening-remarks",
      "destination-diani-memo",
    ],
  },
]

export const issueUpdates = [
  {
    slug: "illegal-beach-structures",
    addProgressUpdates: [
      { date: "2026-06-24", update: "SCRA wrote to the Diani Hospitality Owners Association requesting members undertake landscaping along road-facing property frontages to deter illegal kiosks (bandas) and road-reserve encroachment." },
    ],
    addSupportingDocuments: ["landscaping-letter"],
  },
  {
    slug: "illegal-block-of-flats",
    setStatus: "resolved",
    addProgressUpdates: [
      { date: "2023-12-21", update: "The Environment and Land Court at Kwale (ELC Case No. 12 of 2021) delivered judgement on parcel Kwale/Diani Beach/800 and 801: non-compliant units were ordered altered or demolished within 120 days to comply with zoning height limits and the 50% development coverage rule, with costs awarded against the defendant." },
    ],
    addSupportingDocuments: ["elc-judgement", "elc-newsletter"],
    addRelatedNewsSlug: "elc-case-12-2021-ruling",
  },
]
