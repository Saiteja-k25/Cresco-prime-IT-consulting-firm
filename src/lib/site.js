// Facts about the company, shared by the pages and by the structured data that search engines read.
// The services: from the company's LinkedIn, grouped by the job they do. Copy is a draft for the client to approve.
// No count in the copy: the client is still settling which services to offer.
export const SITE = 'https://www.crescoprime.com';

export const groups = [
  {
    name: 'Advise',
    line: 'We study how your company works today and plan the systems it needs next.',
    items: [
      ['IT consulting and technology solutions', 'We review the tools and systems you run today and write a plan for what to keep, replace or add.'],
      ['Digital transformation', 'We move paper forms, spreadsheets and email chains into software your whole team can use, one process at a time.'],
    ],
  },
  {
    name: 'Build',
    line: 'We design and build software around the way your team works.',
    items: [
      ['Software development', 'We write, test and maintain the code behind your products and internal tools.'],
      ['Custom software solutions', 'When nothing on the market fits how you work, we build the tool that does.'],
      ['Website design and development', 'We design and build websites that load fast on phones and that your team can update without us.'],
      ['Application development', 'We build web and mobile apps for your customers or your staff, from the first sketch to release.'],
    ],
  },
  {
    name: 'Automate',
    line: 'We take repeat work off your team: approvals, reports, data entry, handoffs between tools.',
    items: [
      ['Business process automation', 'We connect the tools you already pay for, so approvals, reports and data entry run without someone copying them by hand.'],
    ],
  },
  {
    name: 'Run',
    line: 'We keep your servers, networks and devices running, and we answer when something breaks.',
    items: [
      ['IT infrastructure and technical support', 'We set up and look after your servers, networks, cloud accounts and devices, and your team has one place to call for help.'],
    ],
  },
];

const linkedin = 'https://www.linkedin.com/company/cresco-prime/';
const instagram = 'https://www.instagram.com/crescoprime/';

// schema.org nodes. One id per thing, so pages can point at each other's nodes.
export const ORG_ID = `${SITE}/#org`;
export const PERSON_ID = `${SITE}/founder/#person`;

export const org = {
  '@type': 'ProfessionalService',
  '@id': ORG_ID,
  name: 'Cresco Prime',
  legalName: 'Cresco Prime LLC',
  url: `${SITE}/`,
  logo: `${SITE}/logo.png`,
  image: `${SITE}/og.png`,
  description:
    'Cresco Prime is an IT services and consulting firm in Frisco, Texas. We plan, build and run software, websites and IT systems for growing companies.',
  slogan: 'Innovating today. Empowering tomorrow.',
  email: 'hr@crescoprime.com',
  telephone: '+1-248-491-9357',
  foundingDate: '2026',
  founder: { '@id': PERSON_ID },
  address: { '@type': 'PostalAddress', addressLocality: 'Frisco', addressRegion: 'TX', addressCountry: 'US' },
  areaServed: [{ '@type': 'Country', name: 'United States' }, 'Worldwide'],
  knowsAbout: groups.flatMap((g) => g.items.map(([name]) => name)),
  sameAs: [linkedin, instagram],
};

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'Cresco Prime',
  inLanguage: 'en-US',
  publisher: { '@id': ORG_ID },
};

export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Kalyan Boddula',
  jobTitle: 'Founder, Director and CEO',
  worksFor: { '@id': ORG_ID },
  url: `${SITE}/founder/`,
  image: `${SITE}/images/kalyan-boddula.webp`,
  knowsAbout: ['Microsoft Azure', 'Identity and access management', 'Single sign-on', 'Multi-factor authentication'],
  sameAs: ['https://www.linkedin.com/in/kalyan-boddula-9abb43396/'],
};

// Every service as a schema.org Service offered by the company.
export const serviceList = {
  '@type': 'ItemList',
  name: 'Cresco Prime services',
  itemListElement: groups.flatMap((g) => g.items).map(([name, description], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: { '@type': 'Service', name, description, provider: { '@id': ORG_ID }, areaServed: org.areaServed },
  })),
};

// Home > page, for the search result's breadcrumb line.
export const crumbs = (name, path) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
  ],
});
