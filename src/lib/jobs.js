// Open roles. Text as supplied by the client (bullets tidied; "Matrix Missions" corrected to Cresco Prime).
// To open a role add an entry, to close one remove it: the Careers page, the role pages and the sitemap follow.
// All roles are fully remote, open to applicants in the US and worldwide (client, 2026-11-19). Google for Jobs needs
// the countries applicants may be in and cannot express "worldwide", so `remote.countries` lists the United States;
// add ISO country codes there to show the roles in other countries' Google results too.
// type: 'FULL_TIME' | 'CONTRACTOR' | 'PART_TIME' | 'TEMPORARY'. core: the main skill the application form asks about.
export const posted = '2026-11-19';
export const remote = { countries: ['US'], label: 'Remote (US and worldwide)' };

export const jobs = [
  {
    slug: 'pingfederate-iam-specialist',
    core: 'PingFederate',
    title: 'PingFederate IAM Specialist',
    department: 'IT · Identity & Access Management',
    experience: '4 to 8 years',
    type: 'CONTRACTOR',
    overview:
      'We are looking for an experienced PingFederate IAM Specialist to design, implement, and manage enterprise Identity and Access Management solutions. The ideal candidate should have strong expertise in authentication, federation, SSO, and identity security.',
    responsibilities: [
      'Implement and manage PingFederate authentication and federation solutions.',
      'Configure SAML 2.0, OAuth 2.0, and OpenID Connect protocols.',
      'Develop and maintain Single Sign-On (SSO) integrations.',
      'Integrate applications with enterprise IAM platforms.',
      'Troubleshoot authentication and authorization issues.',
      'Work with LDAP, Active Directory, and directory services.',
      'Ensure compliance with enterprise security standards.',
    ],
    skills: [
      'Strong experience with PingFederate.',
      'Expertise in SAML, OAuth, OIDC, and SSO.',
      'Knowledge of LDAP and Active Directory.',
      'Understanding of IAM architecture and security concepts.',
      'Experience with REST APIs and application integrations.',
    ],
  },
  {
    slug: 'cyberark-specialist',
    core: 'CyberArk',
    title: 'CyberArk Specialist',
    department: 'Cybersecurity · Privileged Access Management',
    experience: '4 to 8 years',
    type: 'CONTRACTOR',
    overview:
      'We are seeking a skilled CyberArk Specialist to implement, administer, and maintain Privileged Access Management (PAM) solutions. The candidate will be responsible for securing privileged accounts and strengthening enterprise security infrastructure.',
    responsibilities: [
      'Implement and administer CyberArk PAM solutions.',
      'Manage Privileged Account Security (PAS).',
      'Configure Digital Vault, CPM, PVWA, and PSM components.',
      'Manage privileged accounts and password rotation policies.',
      'Implement session monitoring and access controls.',
      'Integrate CyberArk with Active Directory and enterprise applications.',
      'Troubleshoot PAM-related issues and security incidents.',
      'Support audits and security compliance requirements.',
    ],
    skills: [
      'Hands-on experience with CyberArk.',
      'Knowledge of PAM architecture.',
      'Experience with Vault, CPM, PVWA, and PSM.',
      'Knowledge of Windows and Linux environments.',
      'Understanding of enterprise security and access governance.',
    ],
  },
  {
    slug: 'salesforce-developer-consultant',
    core: 'Salesforce',
    title: 'Salesforce Developer / Consultant',
    department: 'Enterprise Applications',
    experience: '3 to 7 years',
    type: 'CONTRACTOR',
    overview:
      'We are looking for a skilled Salesforce Developer/Consultant to develop, customize, and maintain Salesforce applications. The candidate should have experience in Salesforce development, integrations, and CRM implementation.',
    responsibilities: [
      'Develop and customize Salesforce applications.',
      'Work with Apex, Lightning Web Components (LWC), and Visualforce.',
      'Configure Salesforce objects, workflows, and validation rules.',
      'Develop REST and SOAP API integrations.',
      'Implement business automation using Salesforce Flow.',
      'Manage data migration and application enhancements.',
      'Troubleshoot and optimize Salesforce applications.',
      'Collaborate with business and technical teams.',
    ],
    skills: [
      'Hands-on experience with Salesforce CRM.',
      'Strong knowledge of Apex and LWC.',
      'Experience with Salesforce Sales Cloud or Service Cloud.',
      'Knowledge of SOQL and SOSL.',
      'Experience with REST/SOAP APIs.',
      'Understanding of Salesforce security and deployment processes.',
    ],
  },
  {
    slug: 'sap-fico-consultant',
    core: 'SAP FICO',
    title: 'SAP FICO Consultant',
    department: 'SAP / Enterprise Applications',
    experience: '4 to 8 years',
    type: 'FULL_TIME',
    overview:
      'Cresco Prime is looking for an experienced SAP FICO Consultant to implement, configure, and support SAP Financial Accounting (FI) and Controlling (CO) modules. The ideal candidate should have strong knowledge of financial processes, SAP configurations, and business requirements, with experience in SAP ECC or S/4HANA environments.',
    responsibilities: [
      'Configure and support SAP FI and CO modules.',
      'Manage General Ledger (GL), Accounts Payable (AP), and Accounts Receivable (AR).',
      'Work on Asset Accounting (AA) and Bank Accounting.',
      'Handle Cost Center Accounting and Profit Center Accounting.',
      'Configure financial reporting and controlling processes.',
      'Support month-end and year-end closing activities.',
      'Integrate SAP FICO with MM, SD, and other SAP modules.',
      'Participate in SAP implementations, rollouts, and upgrades.',
      'Troubleshoot functional issues and provide technical support.',
      'Coordinate with business stakeholders to gather requirements.',
    ],
    skills: [
      'Hands-on experience in SAP FICO.',
      'Strong knowledge of SAP FI and CO configurations.',
      'Experience with SAP ECC and/or SAP S/4HANA.',
      'Knowledge of GL, AP, AR, AA, and Bank Accounting.',
      'Understanding of Cost Center and Profit Center Accounting.',
      'Experience with SAP integration and financial reporting.',
      'Knowledge of business processes and financial accounting principles.',
    ],
    preferred: [
      'SAP FICO certification is an advantage.',
      'Experience in S/4HANA Finance.',
      'Knowledge of Universal Journal (ACDOCA).',
      'Experience in SAP implementation and migration projects.',
      'Strong analytical and problem-solving skills.',
    ],
  },
  {
    slug: 'ping-davinci-developer',
    core: 'Ping DaVinci',
    title: 'Ping DaVinci Developer',
    department: 'Identity & Access Management',
    experience: '3 to 7 years',
    type: 'CONTRACTOR',
    overview:
      'We are seeking a Ping DaVinci Developer with experience in identity orchestration, authentication workflows, and identity integrations. The candidate will develop and manage secure identity journeys using the Ping Identity DaVinci platform.',
    responsibilities: [
      'Design and develop identity orchestration workflows using Ping DaVinci.',
      'Configure authentication and registration journeys.',
      'Integrate identity services with enterprise applications.',
      'Work with REST APIs and external identity providers.',
      'Implement SSO and authentication workflows.',
      'Troubleshoot workflow and integration issues.',
      'Collaborate with IAM architects and security teams.',
      'Maintain secure and scalable identity solutions.',
    ],
    skills: [
      'Hands-on experience with Ping Identity DaVinci.',
      'Knowledge of OAuth 2.0, OIDC, and SAML.',
      'Experience with REST APIs and JSON.',
      'Understanding of IAM and CIAM concepts.',
      'Knowledge of authentication and authorization mechanisms.',
    ],
  },
  {
    slug: 'network-engineer',
    core: 'enterprise networking',
    title: 'Network Engineer',
    department: 'IT Infrastructure',
    experience: '3 to 7 years',
    type: 'CONTRACTOR',
    overview:
      'We are looking for a Network Engineer to design, implement, monitor, and maintain enterprise network infrastructure. The candidate should have strong networking fundamentals and experience managing secure and reliable network environments.',
    responsibilities: [
      'Configure and maintain routers, switches, and firewalls.',
      'Monitor network performance and troubleshoot connectivity issues.',
      'Manage LAN, WAN, VPN, and wireless networks.',
      'Implement network security policies.',
      'Configure VLANs, routing, and switching protocols.',
      'Work with network monitoring and management tools.',
      'Perform network upgrades and maintenance.',
      'Maintain network documentation and configurations.',
    ],
    skills: [
      'Strong knowledge of TCP/IP, DNS, DHCP, and subnetting.',
      'Experience with Cisco, Juniper, or equivalent technologies.',
      'Knowledge of routing protocols such as BGP, OSPF, and EIGRP.',
      'Experience with firewalls and VPN technologies.',
      'CCNA or CCNP certification preferred.',
    ],
  },
  {
    slug: 'workday-hcm-consultant',
    core: 'Workday HCM',
    title: 'Workday HCM Consultant',
    department: 'Enterprise Applications · HR Technology',
    experience: '3 to 8 years',
    type: 'CONTRACTOR',
    overview:
      'We are looking for an experienced Workday HCM Consultant to implement, configure, and support Workday Human Capital Management solutions. The candidate should understand HR business processes and have hands-on experience with Workday configuration and integrations.',
    responsibilities: [
      'Configure and maintain Workday HCM modules.',
      'Support Workday implementation and enhancement projects.',
      'Manage business processes and workflow configurations.',
      'Work on Core HCM, Compensation, Benefits, and Absence Management.',
      'Support Workday integrations and data migration.',
      'Troubleshoot functional and technical issues.',
      'Coordinate with HR and business stakeholders.',
      'Support testing, reporting, and system upgrades.',
    ],
    skills: [
      'Hands-on experience with Workday HCM.',
      'Knowledge of Core HCM and HR business processes.',
      'Experience with Workday Business Process Configuration.',
      'Knowledge of EIB, Core Connectors, and Workday Studio preferred.',
      'Experience with Workday reporting and calculated fields.',
    ],
  },
];

// Labels for the page.
export const typeLabel = { FULL_TIME: 'Full-time', CONTRACTOR: 'Contract', PART_TIME: 'Part-time', TEMPORARY: 'Temporary' };
