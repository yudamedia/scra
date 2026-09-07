import { getPayload } from 'payload'
import config from '@payload-config'

console.log('Site content seed script starting...')

async function run() {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      orgName: "South Coast Residents' Association",
      tagline:
        'Representing residents, property owners and businesses from Likoni to Lunga Lunga since 1983.',
      contact: {
        phone: '+254 720 998258',
        email: 'chair@scra.co.ke',
        addressLine1: 'Diani, Kenya',
        addressDetail: 'First floor, Diani Beach Shopping Center.',
      },
      social: [{ platform: 'facebook', url: 'https://www.facebook.com/groups/228531647320531/' }],
      payment: {
        paybillNumber: '880100',
        paybillAccount: 'PAYSCRA',
        payInPersonText:
          'Visit the Safarilink Office at Diani Beach Shopping Centre (1st floor) to pay and receive an immediate receipt and membership card.',
      },
      seoDefaults: {
        defaultTitle: "South Coast Residents' Association",
        defaultDescription:
          'Representing residents, property owners and businesses from Likoni to Lunga Lunga.',
      },
      footerLegal: {
        copyrightName: "South Coast Residents' Association",
        builtByText: 'Built by GraphicStation',
      },
    },
  })
  console.log('  site-settings done')

  const issueCategoryChildren = [
    { label: 'Roads & Infrastructure', href: '/issues?category=roads-infrastructure' },
    { label: 'Security', href: '/issues?category=security' },
    { label: 'Water Supply', href: '/issues?category=water-supply' },
    { label: 'Electricity', href: '/issues?category=electricity' },
    { label: 'Waste Management', href: '/issues?category=waste-management' },
    { label: 'Environment', href: '/issues?category=environment' },
    { label: 'Beach Access', href: '/issues?category=beach-access' },
    { label: 'Planning & Development', href: '/issues?category=planning-development' },
  ]

  await payload.updateGlobal({
    slug: 'main-navigation',
    data: {
      headerLinks: [
        { label: 'Home', href: '/', children: [] },
        {
          label: 'About Us',
          href: '/about',
          children: [
            { label: 'About SCRA', href: '/about' },
            { label: 'Leadership', href: '/leadership' },
            { label: 'Committees', href: '/committees' },
          ],
        },
        {
          label: 'Issues',
          href: '/issues',
          children: [
            { label: 'All Issues', href: '/issues' },
            { label: 'Report an Issue', href: '/report-issue' },
            ...issueCategoryChildren,
          ],
        },
        {
          label: 'News & Events',
          href: '/news',
          children: [
            { label: 'Newsroom', href: '/news' },
            { label: 'Events', href: '/events' },
          ],
        },
        {
          label: 'Resources',
          href: '/documents',
          children: [
            { label: 'Knowledge Centre', href: '/documents' },
            { label: 'Community Directory', href: '/directory' },
            { label: 'Area Guides', href: '/areas' },
          ],
        },
        {
          label: 'Membership',
          href: '/membership',
          children: [
            { label: 'Membership Overview', href: '/membership' },
            { label: 'Apply for Membership', href: '/membership/apply' },
          ],
        },
        { label: 'Contact', href: '/contact', children: [] },
      ],
      footerQuickLinks: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Issues', href: '/issues' },
        { label: 'Newsroom', href: '/news' },
        { label: 'Events', href: '/events' },
      ],
      footerResourceLinks: [
        { label: 'Knowledge Centre', href: '/documents' },
        { label: 'Community Directory', href: '/directory' },
        { label: 'Area Guides', href: '/areas' },
        { label: 'Report an Issue', href: '/report-issue' },
        { label: 'Apply for Membership', href: '/membership/apply' },
        { label: 'Member Login', href: '/portal/login' },
        { label: 'Contact Us', href: '/contact' },
      ],
      footerLegalLinks: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
      ],
    },
  })
  console.log('  main-navigation done')

  await payload.updateGlobal({
    slug: 'issue-categories',
    data: {
      categories: [
        {
          value: 'roads-infrastructure',
          label: 'Roads & Infrastructure',
          description: 'Safe, reliable and well-maintained roads.',
          icon: 'road',
          featuredOnHomepage: true,
        },
        {
          value: 'security',
          label: 'Security',
          description: 'Working towards safe communities for all.',
          icon: 'shield-02',
          featuredOnHomepage: true,
        },
        {
          value: 'water-supply',
          label: 'Water Supply',
          description: 'Reliable and sustainable water for all residents.',
          icon: 'droplet',
          featuredOnHomepage: true,
        },
        {
          value: 'electricity',
          label: 'Electricity',
          description: '',
          featuredOnHomepage: false,
        },
        {
          value: 'waste-management',
          label: 'Waste Management',
          description: 'Cleaner communities through better systems.',
          icon: 'recycle-01',
          featuredOnHomepage: true,
        },
        {
          value: 'environment',
          label: 'Environment',
          description: 'Protecting our natural heritage and coastline.',
          icon: 'leaf-01',
          featuredOnHomepage: true,
        },
        {
          value: 'beach-access',
          label: 'Beach Access',
          description: '',
          featuredOnHomepage: false,
        },
        {
          value: 'planning-development',
          label: 'Planning & Development',
          description: 'Responsible development for a sustainable future.',
          icon: 'building-01',
          featuredOnHomepage: true,
        },
      ],
    },
  })
  console.log('  issue-categories done')

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        heading: 'Working Together for a Better South Coast',
        subtext:
          'Representing residents, property owners and businesses from Likoni to Lunga Lunga since 1983.',
        ctaButtons: [
          { label: 'Become a Member', href: '/membership', style: 'primary' },
          { label: 'View Current Issues', href: '/issues', style: 'secondary' },
          { label: 'Latest Updates →', href: '/news', style: 'secondary' },
        ],
      },
      quickLinks: [
        { label: 'About SCRA', sub: 'Who we are', href: '/about', icon: 'information-circle' },
        { label: 'Our Committees', sub: 'Leadership & teams', href: '/committees', icon: 'shield-01' },
        { label: 'Newsroom', sub: 'Latest news', href: '/news', icon: 'news' },
        { label: 'Events', sub: "What's happening", href: '/events', icon: 'calendar-01' },
        { label: 'Knowledge Centre', sub: 'Reports & documents', href: '/documents', icon: 'folder-01' },
        { label: 'Contact Us', sub: 'Get in touch', href: '/contact', icon: 'call-02' },
      ],
      newsSection: { eyebrow: 'News & Updates', heading: 'Stay Informed. Stay Involved.' },
      issuesSection: {
        eyebrow: 'Issues We Are Working On',
        heading: 'Representing Your Interests on the Issues That Matter.',
      },
      membershipCta: {
        heading: 'Stronger Together. Become a Member Today.',
        paragraph:
          'Your membership supports our advocacy, strengthens our voice and helps build a better South Coast.',
        buttonLabel: 'Join / Renew Membership →',
        benefits: [
          {
            icon: 'news',
            title: 'Have Your Voice Heard',
            text: 'Influence decisions that impact our communities.',
          },
          {
            icon: 'folder-01',
            title: 'Access Information',
            text: 'Stay updated with reports, news and alerts.',
          },
          {
            icon: 'building-01',
            title: 'Build a Better South Coast',
            text: 'Together, we create a safer, cleaner and more sustainable region.',
          },
        ],
      },
      eventsEmptyStateText: 'No events scheduled right now — check back soon.',
    },
  })
  console.log('  homepage done')

  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      hero: {
        eyebrow: 'About Us',
        heading: 'Representing the South Coast Since 1983',
        paragraph:
          "SCRA is a non-profit, non-political, non-denominational and non-racial association advancing the interests of residents, property owners and businesses on Kenya's South Coast — from Likoni to Lunga Lunga.",
      },
      stats: {
        foundedYear: '1983',
        membersValue: '1,000+',
        membersLabel: 'Members represented',
        areasServedLabel: 'Areas served, Likoni to Lunga Lunga',
        issuesTrackedLabel: 'Community issues tracked',
      },
      history: {
        root: {
          type: 'root',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  text: "SCRA was established in 1983 as the Likoni & South Mainland Residents Association, initially operating from Shelley Beach. After a period of inactivity, the Association relocated to Diani and resumed operations, growing into the organisation that today represents residents, property owners and businesses across the whole of Kenya's South Coast.",
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
      whoWeRepresent: {
        root: {
          type: 'root',
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'text',
                  text: 'SCRA represents over 1,000 people, including residents, hoteliers, bankers, local businesses, fishermen and youth groups across the South Coast — from the Likoni ferry crossing to the Tanzanian border at Lunga Lunga.',
                  format: 0,
                  detail: 0,
                  mode: 'normal',
                  style: '',
                  version: 1,
                },
              ],
            },
          ],
        },
      },
      whatWeDoIntro:
        "As a non-political, non-profit making, non-denominational and non-racial association, SCRA provides an avenue for representing residents' interests to, and liaising with, all Government of Kenya ministries and the Kwale & Msambweni district offices — serving as a watchdog for the community while working to improve social services and environmental conservation along the coast.",
      whatWeDo: [
        {
          icon: 'shield-user',
          title: 'Community Watchdog',
          text: 'Monitoring development, planning and public conduct that affects residents, and raising concerns with the relevant authorities.',
        },
        {
          icon: 'target-02',
          title: 'Government Liaison',
          text: 'Representing member interests to national and county government ministries and offices on issues affecting the South Coast.',
        },
        {
          icon: 'leaf-01',
          title: 'Environmental Conservation',
          text: 'Partnering with conservation organisations to protect the coastal forest, marine environment and wildlife the South Coast depends on.',
        },
        {
          icon: 'user-group',
          title: 'Social Services',
          text: 'Working to improve the services residents rely on — roads, security, water, electricity and waste management.',
        },
      ],
      bottomCtaCards: [
        {
          title: 'Our Leadership',
          text: "Meet the Executive Committee leading SCRA's work on behalf of South Coast residents.",
          linkLabel: 'Meet the team →',
          href: '/leadership',
        },
        {
          title: 'Our Committees',
          text: "{count} committees and working groups carry out SCRA's work across the South Coast.",
          linkLabel: 'See committees →',
          href: '/committees',
        },
        {
          title: 'Become a Member',
          text: 'Join SCRA and add your voice to a stronger South Coast.',
          linkLabel: 'Join / Renew →',
          href: '/membership',
          featured: true,
        },
      ],
    },
  })
  console.log('  about-page done')

  await payload.updateGlobal({
    slug: 'membership-page',
    data: {
      hero: {
        eyebrow: 'Membership',
        heading: 'Stronger Together. Become a Member.',
        paragraph:
          "Your membership supports SCRA's advocacy, strengthens our collective voice, and helps build a better South Coast for everyone who lives, works and invests here.",
      },
      tiers: [
        { name: 'Individual', type: 'personal', price: 'KES 3,000', period: 'per year', detail: 'One member.', featured: false },
        {
          name: 'Family',
          type: 'household',
          price: 'KES 5,000',
          period: 'per year',
          detail: '2 family members hold voting rights at meetings.',
          featured: true,
        },
        {
          name: 'Corporate',
          type: 'corporate',
          price: 'KES 10,000',
          period: 'per year',
          detail: '4 corporate members hold voting rights at meetings.',
          featured: false,
        },
      ],
      tiersFootnote: 'Membership renews annually.',
      benefits: [
        {
          icon: 'notification-01',
          title: 'Stay Informed',
          text: 'Regular emails on upcoming events, special offers, and security threats or issues affecting the South Coast.',
        },
        {
          icon: 'discount-01',
          title: 'Member Discounts',
          text: 'Discounts with local hotels, resorts, pharmacies, gyms and service providers across Diani and the South Coast.',
        },
        {
          icon: 'megaphone-01',
          title: 'Have Your Voice Heard',
          text: 'Participate in community decisions and use SCRA as a platform to raise environmental or legal concerns.',
        },
        {
          icon: 'document-attachment',
          title: 'Minutes & Newsletters',
          text: 'Minutes of General Meetings held every other month, plus copies of the SCRA newsletter.',
        },
        {
          icon: 'idea',
          title: 'Advisory Services',
          text: 'Advisory support and updates on regulatory changes affecting residents and property owners.',
        },
        {
          icon: 'checkmark-circle-02',
          title: 'Advertising Discounts',
          text: 'Discounted advertising rates for member businesses through SCRA channels.',
        },
      ],
      discounts: {
        heading: 'Current Member Discounts',
        intro: 'A selection of the local businesses currently offering discounts to SCRA members.',
      },
      howToJoin: {
        heading: 'How to Join or Renew',
        applyButtonLabel: 'Apply for Membership Online',
        footerNote: 'Questions about membership? Get in touch via our [Contact page](/contact).',
      },
    },
  })
  console.log('  membership-page done')

  await payload.updateGlobal({
    slug: 'page-intros',
    data: {
      contact: {
        eyebrow: 'Contact',
        heading: 'Get in Touch',
        paragraph: 'Questions, concerns, or want to get involved? Reach out to SCRA using the details below.',
        membershipCalloutText: 'Visit the [Membership page](/membership) for how to join, renew, or pay by M-Pesa.',
      },
      leadership: {
        eyebrow: 'Leadership',
        heading: 'SCRA Executive Committee',
        paragraph: "The people leading SCRA's work on behalf of South Coast residents and property owners.",
      },
      committees: {
        eyebrow: 'Committees',
        heading: 'SCRA Committees',
        paragraph: "The committees and working groups carrying out SCRA's work across the South Coast.",
      },
      directory: {
        eyebrow: 'Community Directory',
        heading: 'Essential South Coast Services',
        paragraph: 'Hospitals, emergency contacts, member businesses, and partner organisations across the South Coast.',
      },
      issues: {
        eyebrow: 'South Coast Issues',
        heading: 'Tracking the Issues That Matter',
        paragraph:
          "From beach access to environmental protection, here's what SCRA is working on across the South Coast — and what's already been resolved.",
      },
      news: {
        eyebrow: 'Newsroom',
        heading: 'Latest from SCRA',
        paragraph: "Updates, meeting notes, and announcements from the South Coast Residents' Association.",
      },
      areas: {
        eyebrow: 'Area Guides',
        heading: 'The South Coast, Area by Area',
        paragraph:
          'From the Likoni ferry crossing to the Tanzanian border at Lunga Lunga, explore what makes each stretch of the South Coast distinct.',
      },
      documents: {
        eyebrow: 'Knowledge Centre',
        heading: 'Reports, Minutes & Public Documents',
        paragraph:
          "A searchable library of SCRA's annual reports, meeting minutes, position papers, and other public documentation.",
        emptyStateText: 'No documents published yet.',
      },
      events: {
        eyebrow: 'Events',
        heading: "What's Happening on the South Coast",
        paragraph:
          'Public participation meetings, community events, environmental activities and committee meetings from SCRA.',
        emptyStateHeading: 'No Events Scheduled Yet',
        emptyStateText:
          "There's nothing on the calendar right now — check back soon, or visit our [Newsroom](/news) for the latest updates.",
      },
      map: {
        eyebrow: 'Interactive Map',
        heading: 'South Coast Map',
        paragraph:
          'Road projects, community facilities, healthcare, schools, and environmental areas SCRA tracks across the South Coast — from Likoni to Lunga Lunga.',
      },
      reportIssue: {
        eyebrow: 'Community Reporting',
        heading: 'Report an Issue',
        paragraph:
          "Tell us about a road, security, environmental, or other issue affecting your area. No membership required — you'll get a reference code to track progress. Already have one? [Check status](/report-issue/status).",
      },
      membershipApply: {
        eyebrow: 'Membership',
        heading: 'Apply for Membership',
        paragraph:
          "Fill in your details below, then pay via M-Pesa/bank transfer or in person. The secretariat confirms your payment and activates your membership — you'll get an email with a link to sign in to the Member Portal, no password required.",
      },
    },
  })
  console.log('  page-intros done')

  console.log('Site content seed complete.')
}

await run()
