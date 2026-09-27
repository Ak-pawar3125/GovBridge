import { Application, Grievance, SchemeInfo, VerificationConnector } from './types';

export const INITIAL_SCHEMES: SchemeInfo[] = [
  {
    id: 'pm-kisan-2026',
    code: 'PM-KISAN-VI',
    title: 'PM Kisan Samman Nidhi (Direct Income Support)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Supplemental financial assistance of ₹6,000 per annum to eligible small & marginal landholder farmer families across India.',
    benefits: '₹2,000 disbursed per trimester directly to Aadhaar-seeded bank account via DBT PFMS gateway.',
    eligibility: 'All landholding farmer families with cultivable land in their names.',
    requiredDocs: ['Aadhaar Card', 'Land Record (Bhulekh / Khasra-Khatauni)', 'Aadhaar-Linked Bank Passbook'],
    maxGrant: 6000,
    iconName: 'Sprout',
    badge: 'Direct Benefit Transfer'
  },
  {
    id: 'ayushman-bharat-pmjay',
    code: 'AB-PMJAY',
    title: 'Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana',
    department: 'National Health Authority (NHA)',
    description: 'Flagship health protection scheme covering secondary and tertiary care hospitalization up to ₹5 Lakhs per family per year.',
    benefits: 'Cashless and paperless access to 27,000+ empanelled hospitals pan-India with zero out-of-pocket expenses.',
    eligibility: 'Families identified via SECC 2011 criteria or state-recognized bottom 40% income bracket.',
    requiredDocs: ['Aadhaar Card', 'Ration Card (NFSA)', 'Active Mobile OTP Verification'],
    maxGrant: 500000,
    iconName: 'HeartPulse',
    badge: 'Universal Healthcare'
  },
  {
    id: 'digital-entrepreneurship-mudra',
    code: 'PMMY-TARUN',
    title: 'Pradhan Mantri MUDRA Yojana (Micro Enterprises)',
    department: 'Ministry of Finance & SIDBI',
    description: 'Collateral-free business loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises for machinery & tech.',
    benefits: 'Subsidized credit guarantee with zero processing fee, instant e-Mudra digital sanction in 48 hours.',
    eligibility: 'Artisans, micro-manufacturers, shopkeepers, service sector ventures with valid Udyam registration.',
    requiredDocs: ['PAN Card', 'Udyam Registration Certificate', '6-Month Bank Statement (Account Aggregator)'],
    maxGrant: 1000000,
    iconName: 'Building2',
    badge: 'MSME Growth'
  },
  {
    id: 'national-scholarship-portal',
    code: 'NSP-POST-MATRIC',
    title: 'Post-Matric Scholarship for Higher Technical Education',
    department: 'Ministry of Social Justice & Empowerment',
    description: 'Full tuition fee reimbursement and maintenance allowance for meritorious students pursuing STEM & vocational degrees.',
    benefits: '100% academic fee waiver + ₹1,200/month stipend credited directly through central scholarship DBT portal.',
    eligibility: 'Enrolled in recognized College/University; family annual gross income under ₹2.5 Lakhs.',
    requiredDocs: ['Income Certificate (e-District verified)', 'College Admission Receipt', '10th & 12th Digilocker Marksheets'],
    maxGrant: 85000,
    iconName: 'GraduationCap',
    badge: 'Education Support'
  },
  {
    id: 'pm-surya-ghar-solar',
    code: 'PMSG-MUFT-BIJLI',
    title: 'PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar)',
    department: 'Ministry of New and Renewable Energy',
    description: 'Direct capital subsidy of up to ₹78,000 for installing grid-connected solar power systems on residential rooftops.',
    benefits: 'Up to 300 units of free electricity per month plus income from surplus energy export to discom net meter.',
    eligibility: 'Indian citizen residential households with legal roof ownership and grid electricity connection.',
    requiredDocs: ['Electricity Bill with Consumer ID', 'Roof Ownership / House Tax Receipt', 'Bank Mandate'],
    maxGrant: 78000,
    iconName: 'Sun',
    badge: 'Green Energy'
  },
  {
    id: 'domicile-caste-certificate',
    code: 'E-DIST-DOC',
    title: 'Official Permanent Domicile & Category Certificate',
    department: 'Revenue & District Administration',
    description: 'Issuance of digitally signed, QR-code verifiable legal certificates for employment, examinations and administrative proceedings.',
    benefits: 'Instant verifiable e-Certificate integrated with DigiLocker and state e-District repository with blockchain hash.',
    eligibility: 'Resident of the state for minimum 5 years or lineage domicile proof.',
    requiredDocs: ['Aadhaar Card', 'Electricity / Water Bill', 'School Leaving Certificate'],
    iconName: 'FileCheck',
    badge: 'Digital Identity'
  }
];

export const INITIAL_CONNECTORS: VerificationConnector[] = [
  {
    id: 'digilocker-api',
    name: 'DigiLocker Central Vault Connector',
    authority: 'Ministry of Electronics & IT (MeitY)',
    type: 'Document & Marksheet Registry',
    status: 'active',
    latencyMs: 84,
    recordsVerifiedToday: 41290,
    uptime: '99.98%'
  },
  {
    id: 'uidai-aadhaar',
    name: 'UIDAI e-KYC & Demographics Bridge',
    authority: 'Unique Identification Authority of India',
    type: 'Biometric & OTP Identity Auth',
    status: 'active',
    latencyMs: 112,
    recordsVerifiedToday: 82510,
    uptime: '99.99%'
  },
  {
    id: 'pfms-dbt-gateway',
    name: 'PFMS Direct Benefit Transfer Gateway',
    authority: 'Controller General of Accounts, MoF',
    type: 'NPCI Aadhaar Payment Bridge System',
    status: 'active',
    latencyMs: 145,
    recordsVerifiedToday: 29400,
    uptime: '99.94%'
  },
  {
    id: 'bhulekh-land-records',
    name: 'e-Dharti & State Bhulekh Registry',
    authority: 'Department of Land Resources',
    type: 'Spatial Cadastral GIS & RoR',
    status: 'active',
    latencyMs: 178,
    recordsVerifiedToday: 13420,
    uptime: '99.85%'
  },
  {
    id: 'account-aggregator',
    name: 'RBI Financial Account Aggregator (AA)',
    authority: 'Reserve Bank of India (Sahamati)',
    type: 'Consent-based Financial Statement Verifier',
    status: 'active',
    latencyMs: 96,
    recordsVerifiedToday: 18770,
    uptime: '99.95%'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'GB-2026-88412',
    userId: 'user_aadhaar_8942_5510',
    schemeId: 'pm-kisan-2026',
    schemeTitle: 'PM Kisan Samman Nidhi (Direct Income Support)',
    department: 'Ministry of Agriculture & Farmers Welfare',
    applicantName: 'Rameshwar Kumar Patel',
    applicantGovId: 'AADHAAR-8942-5510',
    applicantPhone: '+91 98765 43210',
    category: 'welfare',
    status: 'approved',
    submittedAt: '2026-09-21 11:32 AM',
    updatedAt: '2026-09-22 04:15 PM',
    remarks: 'Aadhaar e-KYC and Khasra-Khatauni land record validated via Bhulekh connector. First installment approved for PFMS transfer.',
    verifiedDocuments: [
      { name: 'Aadhaar Demographics', verified: true, source: 'UIDAI Vault' },
      { name: 'Land Record Khatauni (Khasra 412/9)', verified: true, source: 'Bhulekh GIS Connector' },
      { name: 'Aadhaar Seeded Bank Account', verified: true, source: 'NPCI APBS Gateway' }
    ],
    beneficiaryAmount: 6000,
    dbtStatus: 'credited',
    auditHistory: [
      {
        id: 'aud-88412-1',
        timestamp: '2026-09-21 11:32 AM',
        action: 'Application Submitted & Consent Logged',
        actor: 'Rameshwar Kumar Patel (Citizen)',
        statusChange: 'submitted',
        details: 'DEPA Consent artifact #CNST-88412-PMK granted for Aadhaar, Bhulekh, and NPCI verification.',
        system: 'DEPA Consent Engine',
        blockHash: '0x9e12...b4f1 (Fabric Block #1042)'
      },
      {
        id: 'aud-88412-2',
        timestamp: '2026-09-21 11:33 AM',
        action: 'UIDAI Demographic Verification Succeeded',
        actor: 'UIDAI e-KYC Bridge',
        statusChange: 'under_review',
        details: 'Demographic hash matched with 100% confidence. Aadhaar-seeded mobile authenticated via OTP.',
        system: 'UIDAI Connector',
        blockHash: '0x3a44...8c20 (Fabric Block #1043)'
      },
      {
        id: 'aud-88412-3',
        timestamp: '2026-09-21 11:35 AM',
        action: 'Bhulekh Land Records Validation Passed',
        actor: 'Bhulekh Spatial GIS Connector',
        statusChange: 'under_review',
        details: 'Cadastral parcel Khasra 412/9 confirmed in applicant ownership. 2.1 Hectares cultivable arable land.',
        system: 'Bhulekh GIS Connector',
        blockHash: '0x71d0...a994 (Fabric Block #1045)'
      },
      {
        id: 'aud-88412-4',
        timestamp: '2026-09-21 11:36 AM',
        action: 'NPCI Aadhaar Payment Bridge Validation',
        actor: 'NPCI APBS Gateway',
        statusChange: 'verified',
        details: 'Aadhaar-seeded bank account mapped to State Bank of India IFSC SBIN0001842. DBT readiness certified.',
        system: 'PFMS Bridge',
        blockHash: '0x18bc...56e2 (Fabric Block #1047)'
      },
      {
        id: 'aud-88412-5',
        timestamp: '2026-09-22 04:15 PM',
        action: 'Administrative Sanction & DBT Batch Dispatched',
        actor: 'Dr. Anita Roy, IAS (Joint Commissioner)',
        statusChange: 'approved',
        details: 'Sanction letter issued with digital token. ₹6,000 disbursement queued via PFMS Direct Benefit Transfer.',
        system: 'GovBridge Orchestration Engine',
        blockHash: '0x55aa...3371 (Fabric Block #1089)'
      }
    ]
  },
  {
    id: 'GB-2026-89104',
    userId: 'user_aadhaar_7712_4409',
    schemeId: 'ayushman-bharat-pmjay',
    schemeTitle: 'Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana',
    department: 'National Health Authority (NHA)',
    applicantName: 'Sunita Devi Sharma',
    applicantGovId: 'AADHAAR-7712-4409',
    applicantPhone: '+91 98210 11234',
    category: 'welfare',
    status: 'under_review',
    submittedAt: '2026-09-25 09:14 AM',
    updatedAt: '2026-09-26 02:40 PM',
    remarks: 'Ration card database match pending automatic sync with National Food Security Registry. DigiLocker docs matched.',
    verifiedDocuments: [
      { name: 'Aadhaar Biometric e-KYC', verified: true, source: 'UIDAI Vault' },
      { name: 'NFSA Ration Card BPL Tier', verified: false, source: 'e-PDS Central Registry' }
    ],
    beneficiaryAmount: 500000,
    dbtStatus: 'pending',
    auditHistory: [
      {
        id: 'aud-89104-1',
        timestamp: '2026-09-25 09:14 AM',
        action: 'Application Submitted via Citizen Portal',
        actor: 'Sunita Devi Sharma (Citizen)',
        statusChange: 'submitted',
        details: 'Digital e-Sign completed. Request queued in Camunda BPMN workflow.',
        system: 'GovBridge Portal',
        blockHash: '0x44f1...120a (Fabric Block #1201)'
      },
      {
        id: 'aud-89104-2',
        timestamp: '2026-09-25 09:15 AM',
        action: 'UIDAI Demographic Verification Succeeded',
        actor: 'UIDAI e-KYC Bridge',
        statusChange: 'under_review',
        details: 'Biometric record confirmed; linked phone verified via OTP challenge.',
        system: 'UIDAI Connector',
        blockHash: '0x88bb...6632 (Fabric Block #1202)'
      },
      {
        id: 'aud-89104-3',
        timestamp: '2026-09-26 02:40 PM',
        action: 'PDS Connector Sync Dispatched',
        actor: 'e-PDS Central Registry Connector',
        statusChange: 'under_review',
        details: 'Pending response from State Food & Civil Supplies Department node. Retry scheduled in Kafka queue.',
        system: 'Apache Kafka Event Bus',
        blockHash: '0x22ee...99a0 (Fabric Block #1230)'
      }
    ]
  },
  {
    id: 'GB-2026-90455',
    userId: 'user_aadhaar_4412_9901',
    schemeId: 'pm-surya-ghar-solar',
    schemeTitle: 'PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar)',
    department: 'Ministry of New and Renewable Energy',
    applicantName: 'Vikramaditya Verma',
    applicantGovId: 'AADHAAR-4412-9901',
    applicantPhone: '+91 94150 99881',
    category: 'subsidy',
    status: 'verified',
    submittedAt: '2026-09-26 03:22 PM',
    updatedAt: '2026-09-27 10:10 AM',
    remarks: 'Discom consumer electricity bill verified. Roof structural declaration uploaded. Ready for final sanction approval.',
    verifiedDocuments: [
      { name: 'Electricity Utility Consumer ID', verified: true, source: 'National Power Portal' },
      { name: 'Property Tax Index II', verified: true, source: 'e-Registry Digilocker' }
    ],
    beneficiaryAmount: 78000,
    dbtStatus: 'pending',
    auditHistory: [
      {
        id: 'aud-90455-1',
        timestamp: '2026-09-26 03:22 PM',
        action: 'Application Submitted with Rooftop Solar Details',
        actor: 'Vikramaditya Verma (Citizen)',
        statusChange: 'submitted',
        details: '3kW on-grid rooftop solar plant application initialized. Discom CA# 10098234 registered.',
        system: 'GovBridge Portal',
        blockHash: '0x99cc...77e1 (Fabric Block #1310)'
      },
      {
        id: 'aud-90455-2',
        timestamp: '2026-09-26 03:24 PM',
        action: 'DigiLocker Property Record Verified',
        actor: 'DigiLocker Central Vault',
        statusChange: 'under_review',
        details: 'Property Tax Index II fetched and authenticated with municipal server signature.',
        system: 'DigiLocker API',
        blockHash: '0x12bb...88ff (Fabric Block #1312)'
      },
      {
        id: 'aud-90455-3',
        timestamp: '2026-09-27 10:10 AM',
        action: 'Discom Utility Interconnection Verified',
        actor: 'National Power Portal Connector',
        statusChange: 'verified',
        details: 'Discom consumer account active and eligible for 3kW rooftop subsidy. All pre-conditions met.',
        system: 'National Power Portal',
        blockHash: '0x66ff...22bb (Fabric Block #1345)'
      }
    ]
  }
];

export const INITIAL_GRIEVANCES: Grievance[] = [
  {
    id: 'GRV-2026-1044',
    userId: 'user_aadhaar_8942_5510',
    title: 'Delay in DBT Subsidy Credit for Rooftop Solar Vendor',
    department: 'Ministry of New and Renewable Energy',
    description: 'Solar panel installed and net-meter synchronized 21 days ago, but the ₹78,000 central subsidy is still reflecting as under validation on the Discom portal.',
    category: 'Direct Benefit Transfer / Payment Discrepancy',
    citizenName: 'Rameshwar Kumar Patel',
    citizenGovId: 'AADHAAR-8942-5510',
    citizenPhone: '+91 98765 43210',
    priority: 'high',
    status: 'in_progress',
    submittedAt: '2026-09-23 04:30 PM',
    updatedAt: '2026-09-25 11:00 AM',
    assignedOfficer: 'Smt. Anita Roy (Joint Commissioner, Energy Redressal)',
    resolutionNote: 'Escalated to State Discom nodal officer. Net-meter telemetry feed was refreshed; payment queue scheduled for next PFMS batch.'
  },
  {
    id: 'GRV-2026-1078',
    userId: 'user_aadhaar_3109_8812',
    title: 'Discrepancy in Name Spelling on DigiLocker Domicile Record',
    department: 'Revenue & District Administration',
    description: 'My middle name has a typo in the digital record compared to the Physical Domicile Issued in 2021.',
    category: 'Certificate Correction / e-District Registry',
    citizenName: 'Priya Sundaram',
    citizenGovId: 'AADHAAR-3109-8812',
    citizenPhone: '+91 99001 22334',
    priority: 'medium',
    status: 'resolved',
    submittedAt: '2026-09-19 10:00 AM',
    updatedAt: '2026-09-21 03:45 PM',
    assignedOfficer: 'Shri V. Murugan (Sub-Divisional Magistrate)',
    resolutionNote: 'Corrected via e-District master ledger against Class 10 Matriculation certificate. New QR-code certificate pushed to user DigiLocker.'
  }
];
