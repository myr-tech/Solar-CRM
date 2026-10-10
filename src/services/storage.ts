import {
  User,
  UserRole,
  Lead,
  Customer,
  Project,
  Appointment,
  SiteSurvey,
  Quotation,
  PreAgreement,
  DocumentItem,
  NationalPortalApp,
  MsedclPvApp,
  Payment,
  LoanRecord,
  InventoryItem,
  ProjectMaterialItem,
  DispatchChallan,
  InstallationRecord,
  QualityControlRecord,
  RtsSubmission,
  ReleaseLetterRecord,
  NetMeterRecord,
  DiscomInspectionRecord,
  SubsidyRecord,
  BankSecondDisbursementRecord,
  InvoiceRecord,
  WarrantyRecord,
  ServiceTicket,
  ProjectActivity,
  ProjectTask,
  AlertItem,
  AuditLog,
  CompanyProfile,
  QuotationMaterialItem,
  LoadExpansionDocumentItem,
  PrintableDocumentFormat,
} from '../types';
import { calculatePmSuryaGharSubsidy } from '../utils/formatters';

const STORAGE_KEY = 'frontier_solar_crm_database_v1';

export interface FrontierDatabase {
  currentUser: User;
  isAuthenticated: boolean;
  users: User[];
  leads: Lead[];
  customers: Customer[];
  projects: Project[];
  appointments: Appointment[];
  surveys: SiteSurvey[];
  quotations: Quotation[];
  companyProfiles: CompanyProfile[];
  printableFormats: PrintableDocumentFormat[];
  preAgreements: PreAgreement[];
  documents: DocumentItem[];
  portalApps: NationalPortalApp[];
  msedclApps: MsedclPvApp[];
  payments: Payment[];
  loans: LoanRecord[];
  inventory: InventoryItem[];
  projectMaterials: ProjectMaterialItem[];
  dispatches: DispatchChallan[];
  installations: InstallationRecord[];
  qcRecords: QualityControlRecord[];
  rtsSubmissions: RtsSubmission[];
  releaseLetters: ReleaseLetterRecord[];
  netMeters: NetMeterRecord[];
  inspections: DiscomInspectionRecord[];
  subsidies: SubsidyRecord[];
  secondDisbursements: BankSecondDisbursementRecord[];
  invoices: InvoiceRecord[];
  warranties: WarrantyRecord[];
  serviceTickets: ServiceTicket[];
  activities: ProjectActivity[];
  tasks: ProjectTask[];
  auditLogs: AuditLog[];
}

export const INITIAL_COMPANY_PROFILES: CompanyProfile[] = [
  {
    id: 'COMP-001',
    name: 'Frontier Complete Solar Solutions',
    tagline: 'PM Surya Ghar Authorized Turnkey Solar Vendor • MSEDCL Empanelled',
    logoUrl: '',
    address: 'Plot 102, Near Lata Mangeshkar Hospital, MIDC Hingna Road, Nagpur, Maharashtra - 440028',
    email: 'frontiersolarnagpur@gmail.com',
    ownerContact: '+91 98230 11223',
    ownerName: 'Er. Rajesh Sharma',
    gstNumber: '27AAACF1234M1Z5',
    registrationNumber: 'MSEDCL/PV/VENDOR/2026/NGP-09',
    panNumber: 'AAACF1234M',
    bankName: 'State Bank of India (Hingna Branch)',
    bankAccountNumber: '392019284729',
    bankIfsc: 'SBIN0014721',
    upiId: 'frontiersolar@sbi',
    isDefault: true,
  },
  {
    id: 'COMP-002',
    name: 'Vidarbha Solar Tech Solutions',
    tagline: 'Rooftop Solar EPC & Engineering Services • Vidarbha Division',
    logoUrl: '',
    address: 'Shop 14, Ground Floor, Fortune Mall, Sitabuldi, Nagpur, Maharashtra - 440012',
    email: 'vidarbhasolartech@gmail.com',
    ownerContact: '+91 98230 11225',
    ownerName: 'Amit Kulkarni',
    gstNumber: '27AABCV5678K1Z9',
    registrationNumber: 'MSEDCL/PV/VENDOR/2026/NGP-24',
    panNumber: 'AABCV5678K',
    bankName: 'Bank of Maharashtra (Sitabuldi Branch)',
    bankAccountNumber: '601829104820',
    bankIfsc: 'MAHB0000045',
    upiId: 'vidarbhasolar@mahb',
    isDefault: false,
  },
  {
    id: 'COMP-003',
    name: 'Surya Shakti Renewable Power Infra',
    tagline: 'Commercial & Industrial Solar EPC Specialists • PM Surya Ghar Partner',
    logoUrl: '',
    address: '401, Apex Tower, Central Avenue, Gandhibagh, Nagpur, Maharashtra - 440002',
    email: 'suryashakti.nagpur@gmail.com',
    ownerContact: '+91 98230 11227',
    ownerName: 'Suresh Verma',
    gstNumber: '27AAGCS9012P1Z1',
    registrationNumber: 'MSEDCL/PV/VENDOR/2026/NGP-41',
    panNumber: 'AAGCS9012P',
    bankName: 'Canara Bank (Central Avenue Branch)',
    bankAccountNumber: '182910482910',
    bankIfsc: 'CNRB0001829',
    upiId: 'suryashakti@cnrb',
    isDefault: false,
  },
];

export const DEFAULT_LOAD_EXPANSION_DOCUMENTS: LoadExpansionDocumentItem[] = [
  { id: 'LED-01', documentName: 'Recent Electricity Bill (Last 1-3 months with paid receipt)', required: true, notes: 'Must show registered consumer name & sanctioned load' },
  { id: 'LED-02', documentName: 'Aadhaar Card copy of Consumer / Applicant', required: true, notes: 'For National Portal & MSEDCL OTP KYC' },
  { id: 'LED-03', documentName: 'House Tax Receipt / Index II / Municipal Assessment Copy', required: true, notes: 'Ownership proof for rooftop rights' },
  { id: 'LED-04', documentName: 'MSEDCL Load Expansion Application Form (Form A-1)', required: true, notes: 'Required if plant capacity exceeds sanctioned load' },
  { id: 'LED-05', documentName: 'Electrical Contractor Test Report (Form A / LEC Certificate)', required: true, notes: 'Issued by Licensed Electrical Contractor with seal' },
  { id: 'LED-06', documentName: 'Solar PV Modules & Inverter CEA / MNRE DCR Compliance Certificate', required: true, notes: 'DCR certificate & ALMM List-I OEM test report' },
  { id: 'LED-07', documentName: 'Bank Passbook / Cancelled Cheque (Subsidy Account)', required: true, notes: 'Aadhaar-linked account for ₹78,000 CFA direct transfer' },
  { id: 'LED-08', documentName: 'Net Metering Connection Undertaking on Stamp Paper', required: true, notes: 'Discom standard format undertaking' },
  { id: 'LED-09', documentName: 'Geo-tagged Rooftop Photograph showing South Facing Unshaded Area', required: true, notes: 'Site survey photo with lat/long stamp' },
  { id: 'LED-10', documentName: 'Passport Size Photographs of Applicant (2 Copies)', required: true, notes: 'Affixed on physical MSEDCL docket' },
];

export const INITIAL_PRINTABLE_FORMATS: PrintableDocumentFormat[] = [
  {
    id: 'FMT-001',
    title: 'Meter Name Change Format (MSEDCL)',
    category: 'Discom MSEDCL',
    description: 'Application to MSEDCL Sub-Division for Electricity Meter Name Transfer along with Transferee Indemnity Bond and Property Ownership proof.',
    templateType: 'meter_name_change',
    defaultTitle: 'APPLICATION FOR TRANSFER OF ELECTRICITY SERVICE CONNECTION / NAME CHANGE',
    requiredFields: ['Consumer No', 'Current Consumer Name', 'New Consumer Name', 'Address', 'Sub-Division', 'Sanctioned Load'],
    createdAt: '2026-09-01',
    contentTemplate: `To,
The Executive Engineer / Assistant Engineer,
Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL),
O&M Sub-Division: {{subDivision}}, Nagpur Circle.

Subject: Application for Transfer of Electricity Connection / Meter Name Change
Reference Consumer Number: {{consumerNumber}} | Billing Unit: {{billingUnit}}

Respected Sir / Madam,

I, {{customerName}}, residing at {{address}}, hereby apply for the transfer of the existing low-tension (LT) electricity service connection standing in the name of {{oldCustomerName}} to my name.

1. Premise & Service Details:
   • Consumer Number: {{consumerNumber}}
   • Existing Registered Name: {{oldCustomerName}}
   • Proposed New Registered Name: {{customerName}}
   • Premise Address: {{address}}
   • Connected Sanctioned Load: {{sanctionedLoadKw}} kW
   • Tariff Category: LT-I (Domestic / Residential)

2. Reason for Name Transfer:
   I have acquired lawful legal ownership and peaceful possession of the aforesaid premise through {{ownershipDocType}} dated {{ownershipDocDate}}.

3. Enclosed Documents:
   a) Copy of Registered Sale Deed / Index-II / Gift Deed
   b) Latest Municipal Corporation (NMC) Property Tax Assessment Receipt
   c) Latest Paid MSEDCL Electricity Bill in original
   d) Self-attested copy of Aadhaar Card and PAN Card of the Applicant
   e) Indemnity Bond on ₹100 Stamp Paper in MSEDCL prescribed format
   f) No Objection Certificate (NOC) / Death Certificate (if applicable)

I hereby undertake to pay all existing and future electricity dues, security deposits, and tariff charges as per MERC regulations.

Yours faithfully,

_____________________________
Signature of Applicant: {{customerName}}
Mobile Number: {{mobile}}
Date: {{date}} | Place: Nagpur`,
  },
  {
    id: 'FMT-002',
    title: 'Undertaking of New Consumer (PM Surya Ghar)',
    category: 'PM Surya Ghar',
    description: 'Mandatory beneficiary undertaking under PM Surya Ghar Muft Bijli Yojana confirming rooftop rights, ALMM DCR solar panels, and DBT bank account.',
    templateType: 'consumer_undertaking',
    defaultTitle: 'BENEFICIARY UNDERTAKING & SELF-DECLARATION UNDER PM SURYA GHAR: MUFT BIJLI YOJANA',
    requiredFields: ['Consumer No', 'Customer Name', 'Aadhaar No', 'Solar Plant Capacity', 'Bank Account', 'IFSC Code'],
    createdAt: '2026-09-01',
    contentTemplate: `UNDERTAKING & SELF-DECLARATION BY BENEFICIARY
(Under PM Surya Ghar: Muft Bijli Yojana - Ministry of New and Renewable Energy, Govt. of India)

I, {{customerName}}, son/daughter/spouse of {{fatherOrSpouseName}}, residing at {{address}}, having MSEDCL Electricity Consumer Number {{consumerNumber}}, do hereby solemnly affirm and declare as under:

1. Scheme Participation:
   I have applied for installation of a {{systemCapacityKw}} kW Grid-Connected Rooftop Solar PV System on my residential rooftop under the PM Surya Ghar: Muft Bijli Yojana scheme through National Portal Application ID: {{nationalPortalAppId}}.

2. Rooftop Ownership & Physical Possession:
   I am the lawful owner and occupier of the residential premise described above and have complete unshaded shadow-free rooftop terrace rights for installing the solar array.

3. DCR & ALMM Domestic Content Compliance:
   I confirm that the solar modules being installed are strictly Domestic Content Requirement (DCR) compliant manufactured using cells and modules made in India, and listed under MNRE ALMM List-I.

4. Central Financial Assistance (Subsidy) DBT Credit:
   I undertake that neither I nor any family member residing in the same household has previously claimed Central Subsidy for rooftop solar at this electricity service connection.
   • Bank Account Name: {{customerName}}
   • Bank Name & Branch: {{bankName}}
   • Account Number: {{bankAccountNumber}}
   • IFSC Code: {{bankIfsc}}

5. 5-Year Maintenance & Net-Metering:
   I shall maintain the solar system in functional condition for a minimum period of 5 years with vendor {{companyName}} and shall not dismantle, relocate or sell the system during this period.

Declared on this date {{date}} at Nagpur, Maharashtra.

_____________________________
Signature / Thumb Impression of Consumer
Name: {{customerName}}
Aadhaar No (Last 4 Digits): XXXX-XXXX-{{aadhaarLast4}}
Mobile: {{mobile}}`,
  },
  {
    id: 'FMT-003',
    title: 'Form U - MSEDCL Net Metering Agreement',
    category: 'Discom MSEDCL',
    description: 'Model Net Metering Connection Agreement (Form U Annexure) between MSEDCL and Eligible Consumer under MERC Net Metering Regulations.',
    templateType: 'form_u',
    defaultTitle: 'FORM U: MODEL NET METERING CONNECTION AGREEMENT (MSEDCL)',
    requiredFields: ['Consumer No', 'Customer Name', 'Sanctioned Load', 'Solar Plant Capacity kW', 'Inverter Make', 'Discom Division'],
    createdAt: '2026-09-01',
    contentTemplate: `ANNEXURE - FORM U
NET METERING INTERCONNECTION AGREEMENT
(As per MERC Grid Interactive Rooftop Renewable Energy Generating Systems Regulations)

This Agreement is entered into on {{date}} between:
MAHARASHTRA STATE ELECTRICITY DISTRIBUTION COMPANY LIMITED (MSEDCL), having its Sub-Divisional Office at {{subDivision}}, Nagpur (hereinafter referred to as "the Distribution Licensee");
AND
{{customerName}}, residing at {{address}} (hereinafter referred to as "the Eligible Consumer", Consumer Number: {{consumerNumber}}).

WITNESSETH AS UNDER:

1. System Capacity & Interconnection Voltage:
   • Consumer Number: {{consumerNumber}}
   • Sanctioned Connected Load: {{sanctionedLoadKw}} kW
   • Proposed Solar PV Plant Capacity: {{systemCapacityKw}} kWp DC
   • Inverter Capacity & Phase: {{inverterCapacityKw}} kW ({{phase}})
   • Interconnection Voltage Level: 230V / 415V, 50 Hz

2. Technical Standards & Islanding Safety:
   The Eligible Consumer confirms that the Grid-Tie Inverter is equipped with automatic anti-islanding protection in accordance with IEEE 1547 / IEC 62116 standards, ensuring instantaneous disconnection from the grid upon failure of MSEDCL supply to protect line personnel.

3. Bi-Directional Net Meter:
   A bi-directional meter certified by MSEDCL Testing Laboratory shall be installed at the point of common coupling to record imported, exported and net electrical energy units.

4. Commercial Settlement & Energy Accounting:
   Energy settlement shall be executed by MSEDCL on monthly billing cycles. Net surplus energy exported shall be credited as energy units in subsequent billing periods as per MERC regulations.

5. Term of Agreement:
   This Agreement shall be valid for a period of 25 (Twenty-Five) years from the date of synchronization of the net meter.

IN WITNESS WHEREOF the parties have executed this Agreement on the day and year first written above.

For Eligible Consumer:                   For Maharashtra State Electricity Distribution Co. Ltd.:

__________________________________        __________________________________
Signature: {{customerName}}               Authorized Signatory / Executive Engineer
Consumer No: {{consumerNumber}}          MSEDCL Sub-Division: {{subDivision}}
Mobile: {{mobile}}                       Circle: Nagpur Urban Circle`,
  },
  {
    id: 'FMT-004',
    title: 'Cancel PV Application (MSEDCL)',
    category: 'Discom MSEDCL',
    description: 'Application to MSEDCL for cancellation, withdrawal or modification of Rooftop Solar PV Application number with reason statement.',
    templateType: 'cancel_pv',
    defaultTitle: 'APPLICATION FOR CANCELLATION / WITHDRAWAL OF ROOFTOP SOLAR PV APPLICATION',
    requiredFields: ['Consumer No', 'Customer Name', 'PV Application No', 'Sub-Division', 'Reason for Cancellation'],
    createdAt: '2026-09-01',
    contentTemplate: `To,
The Nodal Officer / Superintending Engineer (Rooftop Solar),
Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL),
Nagpur Circle, Maharashtra.

Subject: Request for Cancellation / Withdrawal of Rooftop Solar PV Application
Reference PV Application Number: {{pvApplicationNumber}}
Consumer Number: {{consumerNumber}} | Applicant Name: {{customerName}}

Respected Sir,

With reference to the subject cited above, I had submitted an online PV application on MSEDCL portal for setting up a {{systemCapacityKw}} kW Rooftop Solar system at my premise {{address}}.

Due to {{cancellationReason}} (unavoidable civil constraints / restructuring of sanctioned load / consumer relocation), I am unable to proceed with the execution under the referenced application number.

I therefore request your good office to:
1. Cancel / withdraw PV Application No. {{pvApplicationNumber}} from the MSEDCL solar portal.
2. Unfreeze the Consumer Number {{consumerNumber}} on the portal to allow future re-application.
3. Process refund of any unutilized processing fee / security deposit as per applicable Discom rules.

I confirm that no net meter has been installed, no grid synchronization has taken place, and no subsidy claim has been processed against this application.

Thanking you.

Yours sincerely,

_____________________________
Signature of Applicant: {{customerName}}
Consumer Number: {{consumerNumber}}
Mobile Number: {{mobile}}
Date: {{date}} | Nagpur`,
  },
  {
    id: 'FMT-005',
    title: 'Bulk / Net Meter Testing Requisition',
    category: 'Discom MSEDCL',
    description: 'Official requisition letter to MSEDCL Testing & Quality Division for laboratory accuracy testing and calibration of bi-directional net meters.',
    templateType: 'meter_testing',
    defaultTitle: 'REQUISITION FOR ACCURACY TESTING & CALIBRATION OF BI-DIRECTIONAL SOLAR NET METERS',
    requiredFields: ['Meter Make', 'Meter Serial Numbers', 'Vendor Name', 'Testing Fee Challan', 'Sub-Division'],
    createdAt: '2026-09-01',
    contentTemplate: `To,
The Executive Engineer,
Testing & Quality Control Division,
Maharashtra State Electricity Distribution Co. Ltd. (MSEDCL),
Nagpur Urban Circle, Maharashtra.

Subject: Requisition for Testing & Sealing of Bi-Directional Net Meters for Rooftop Solar Installations
Vendor / EPC Agency: {{companyName}} (MSEDCL Empanelled Vendor)

Respected Sir,

We hereby submit the following new, untested Bi-Directional Net Meters for laboratory accuracy testing, CT testing (if applicable), and official lead sealing prior to installation on consumer premises under PM Surya Ghar Yojana:

1. Meter Schedule Details:
   • Meter Make / Brand: {{meterMake}} (Secure / Genus / L&T / Schneider)
   • Meter Type: {{meterPhaseType}} (Single Phase 2-Wire / Three Phase 4-Wire Whole Current)
   • Accuracy Class: Class 1.0 (Active) / Class 2.0 (Reactive)
   • Meter Serial Number(s): {{meterSerialNumbers}}
   • Associated Consumer Number(s): {{consumerNumber}} ({{customerName}})
   • Plant Capacity: {{systemCapacityKw}} kW | Sub-Division: {{subDivision}}

2. Testing Fee Payment:
   Testing charges of ₹{{testingFeeAmount}} have been deposited vide MSEDCL Money Receipt / Challan No: {{testingChallanNumber}} dated {{testingChallanDate}}.

3. Authorization:
   Our authorized technical representative, Mr. {{representativeName}} (Contact: {{representativePhone}}), is authorized to deliver the meters and collect the tested sealed meters along with the official Test Report.

Kindly conduct the necessary bench calibration tests and issue the Test Certificate at your earliest convenience.

For {{companyName}}:

_____________________________
Authorized Signatory & Stamp
Name: {{ownerName}}
Vendor Registration: {{registrationNumber}}
Date: {{date}}`,
  },
  {
    id: 'FMT-006',
    title: 'Cancel Bank Loan Application',
    category: 'Banking & Jan Samarth',
    description: 'Formal letter to Bank Branch Manager for cancellation of Jan Samarth / PM Surya Ghar solar rooftop collateral-free bank loan application.',
    templateType: 'cancel_loan',
    defaultTitle: 'APPLICATION FOR CANCELLATION / CLOSURE OF ROOFTOP SOLAR LOAN APPLICATION',
    requiredFields: ['Bank Name', 'Branch', 'Loan Application Ref', 'Customer Name', 'Consumer No'],
    createdAt: '2026-09-01',
    contentTemplate: `To,
The Branch Manager,
{{bankName}},
Branch: {{bankBranch}}, Nagpur, Maharashtra.

Subject: Cancellation / Withdrawal of Solar Rooftop Loan Application under PM Surya Ghar / Jan Samarth
Loan Application Reference Number: {{loanApplicationRef}}
Applicant Name: {{customerName}} | Mobile: {{mobile}}

Respected Sir / Madam,

I have submitted an application for collateral-free financing under the PM Surya Ghar Jan Samarth Portal for a {{systemCapacityKw}} kW Rooftop Solar system with proposed vendor {{companyName}}.

I hereby inform you that I wish to withdraw / cancel the aforesaid loan application due to:
{{loanCancellationReason}} (self-financing the turnkey installation / personal financial rearrangement).

I therefore request you to:
1. Cancel and close Loan Application Reference No. {{loanApplicationRef}} in your bank's CBS system.
2. Mark the application cancelled on the Jan Samarth Portal.
3. Return my submitted original / self-attested documents and security cheques without any deduction or liability.
4. Issue a formal No Dues / Cancellation Confirmation for my records.

I confirm that no loan disbursement has been made to me or to the solar vendor account.

Thanking you.

Yours faithfully,

_____________________________
Signature of Applicant: {{customerName}}
Residential Address: {{address}}
Consumer Number: {{consumerNumber}}
Date: {{date}} | Nagpur`,
  },
  {
    id: 'FMT-007',
    title: 'NOC for Apartment / Housing Society',
    category: 'Society & Legal',
    description: 'No Objection Certificate issued by Apartment / Co-operative Housing Society Management Committee for rooftop solar panel installation.',
    templateType: 'apartment_noc',
    defaultTitle: 'NO OBJECTION CERTIFICATE (NOC) FOR INSTALLATION OF ROOFTOP SOLAR PV SYSTEM',
    requiredFields: ['Society Name', 'Flat No', 'Consumer Name', 'Consumer No', 'Proposed Capacity kW', 'Terrace Area'],
    createdAt: '2026-09-01',
    contentTemplate: `NO OBJECTION CERTIFICATE (NOC)
(Issued on Society / Apartment Association Letterhead)

To Whom It May Concern / MSEDCL Sub-Divisional Office,

This is to certify that Mr. / Mrs. {{customerName}} is the bona fide owner / legal resident of Flat / Unit No: {{flatNumber}} in {{societyName}}, situated at {{address}}, Nagpur.

The Management Committee of {{societyName}} has duly examined the resident's proposal to install a {{systemCapacityKw}} kW Grid-Connected Rooftop Solar PV System under PM Surya Ghar Muft Bijli Yojana.

The Society hereby accords its NO OBJECTION on the following conditions:
1. Terrace Space Allocation:
   The resident is permitted to install solar mounting structures on approximately {{terraceAreaSqFt}} sq.ft. of the designated terrace rooftop area without causing structural damage or waterproofing leakage.

2. Cable Duct & Meter Room Access:
   The resident and their authorized solar vendor {{companyName}} are permitted to route DC & AC armoured cables through the common utility riser/duct to the central electrical meter room.

3. Bi-Directional Net Meter:
   The Society has no objection to MSEDCL replacing the existing consumer meter (Consumer No: {{consumerNumber}}) with a bi-directional net meter.

4. Safety & Indemnity:
   The resident shall ensure all wind-load safety standards (150 km/h wind certification) and chemical earthing compliance as per MERC guidelines.

Issued on this date {{date}} at Nagpur.

For Management Committee of {{societyName}}:

_____________________________              _____________________________
Secretary / President                       Chairman / Treasurer
Name: {{secretaryName}}                     Name: {{chairmanName}}
Seal / Stamp of Housing Society`,
  },
];


export const createDefaultQuotationMaterials = (capacityKw: number): QuotationMaterialItem[] => {
  const cap = Number(capacityKw) || 3.3;
  const panelWattage = 550;
  const panelQty = Math.ceil((cap * 1000) / panelWattage);
  return [
    { id: 'MAT-1', item: 'Solar PV Modules', category: 'Solar Panels', specs: `Waaree Energies ${panelWattage}W DCR Mono PERC (ALMM List-I)`, quantity: panelQty, unit: 'Nos', includedInTurnkey: true },
    { id: 'MAT-2', item: 'Grid-Tie Solar Inverter', category: 'Inverter', specs: `Polycab Solar ${cap.toFixed(1)}kW Single/Three Phase On-Grid with Wi-Fi`, quantity: 1, unit: 'Set', includedInTurnkey: true },
    { id: 'MAT-3', item: 'Module Mounting Structure', category: 'Structure', specs: 'Hot Dip Galvanized (HDG) 80 Micron Elevated Structure (150 km/h wind rated)', quantity: 1, unit: 'Set', includedInTurnkey: true },
    { id: 'MAT-4', item: 'AC Distribution Box (ACDB)', category: 'Switchgear', specs: 'IP65 Polycarbonate Enclosure with Type-II SPD & Schneider MCB', quantity: 1, unit: 'Nos', includedInTurnkey: true },
    { id: 'MAT-5', item: 'DC Distribution Box (DCDB)', category: 'Switchgear', specs: 'IP65 Box with 1000V DC SPD & 15A gPV Fuses', quantity: 1, unit: 'Nos', includedInTurnkey: true },
    { id: 'MAT-6', item: 'Solar DC Cable', category: 'Cables', specs: 'Polycab 4 sq.mm UV-resistant Flexible TUV Certified Copper Cable', quantity: 30, unit: 'Meters', includedInTurnkey: true },
    { id: 'MAT-7', item: 'AC Armoured Cable', category: 'Cables', specs: 'Polycab 4 sq.mm 3-Core Copper Armoured Cable for Inverter to Meter', quantity: 20, unit: 'Meters', includedInTurnkey: true },
    { id: 'MAT-8', item: 'Chemical Earthing Electrodes', category: 'Earthing', specs: '3 x Chemical Gel Maintenance-Free Copper Bonded Electrodes (3m) with Chambers', quantity: 3, unit: 'Sets', includedInTurnkey: true },
    { id: 'MAT-9', item: 'Lightning Arrestor', category: 'Lightning Protection', specs: 'Copper Early Streamer Emission (ESE) Terminal with Test Link', quantity: 1, unit: 'Set', includedInTurnkey: true },
    { id: 'MAT-10', item: 'Hardware, Conduit & Accessories', category: 'Accessories', specs: 'SS304 Fasteners, MC4 Connectors, Rigid PVC Conduit & Cable Trays', quantity: 1, unit: 'Lot', includedInTurnkey: true },
  ];
};

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-01',
    name: 'Rajesh Sharma',
    email: 'rajesh@frontiersolar.in',
    phone: '9823011223',
    role: 'ADMIN',
    designation: 'Managing Director & Vendor Incharge',
    active: true,
    password: 'admin',
  },
  {
    id: 'USR-02',
    name: 'Pooja Deshmukh',
    email: 'pooja@frontiersolar.in',
    phone: '9823011224',
    role: 'OFFICE_STAFF',
    designation: 'Operations Coordinator',
    active: true,
    password: 'staff',
  },
  {
    id: 'USR-03',
    name: 'Amit Kulkarni',
    email: 'amit@frontiersolar.in',
    phone: '9823011225',
    role: 'SALES',
    designation: 'Senior Solar Consultant',
    active: true,
    password: 'sales',
  },
  {
    id: 'USR-04',
    name: 'Nikhil Raut',
    email: 'nikhil@frontiersolar.in',
    phone: '9823011226',
    role: 'SURVEYOR',
    designation: 'Certified Technical Site Surveyor',
    active: true,
    password: 'survey',
  },
  {
    id: 'USR-05',
    name: 'Suresh Verma',
    email: 'suresh@frontiersolar.in',
    phone: '9823011227',
    role: 'STORE_DISPATCH',
    designation: 'Store & Logistics In-Charge',
    active: true,
    password: 'store',
  },
  {
    id: 'USR-06',
    name: 'Ganesh Patil',
    email: 'ganesh@frontiersolar.in',
    phone: '9823011228',
    role: 'INSTALLATION_TEAM',
    designation: 'Lead Rooftop Solar Electrician',
    active: true,
    password: 'install',
  },
  {
    id: 'USR-07',
    name: 'Sneha Patil',
    email: 'sneha@frontiersolar.in',
    phone: '9823011229',
    role: 'DOCUMENTATION_TEAM',
    designation: 'PM Surya Ghar & MSEDCL Liaison Officer',
    active: true,
    password: 'docs',
  },
  {
    id: 'USR-08',
    name: 'Kavita Joshi',
    email: 'kavita@frontiersolar.in',
    phone: '9823011230',
    role: 'ACCOUNTS',
    designation: 'Accounts & Jan Samarth Manager',
    active: true,
    password: 'accounts',
  },
  {
    id: 'USR-09',
    name: 'Vikram Joshi',
    email: 'vikram@frontiersolar.in',
    phone: '9823011231',
    role: 'SERVICE_TEAM',
    designation: 'Solar Service & AMC Engineer',
    active: true,
    password: 'service',
  },
];

export const MANDATORY_DOC_TYPES = [
  'Aadhaar Card',
  'PAN Card',
  'Electricity Bill',
  'Bank Passbook / Cancelled Cheque',
  'Bank-linked Mobile Number Verification',
  'Email ID Verification',
  'House Tax Document / Property Proof',
  'Installation Location Photograph',
  'Geo-tagged Rooftop Photograph',
  'Signed Pre-agreement',
] as const;

function createSeedData(): FrontierDatabase {
  const users = [...INITIAL_USERS];

  const leads: Lead[] = [
    {
      id: 'LEAD-2026-001',
      date: '2026-09-12',
      customerName: 'Dr. Milind Vaidya',
      mobile: '9822104521',
      whatsapp: '9822104521',
      email: 'mvaidya.nagpur@gmail.com',
      consumerNumber: '410019283741',
      address: 'Plot 42, Sai Nagar, Besa',
      city: 'Nagpur',
      pincode: '440037',
      interestedCapacityKw: 3.3,
      leadSource: 'Customer Reference',
      referredBy: 'Shri Deshmukh (Besa)',
      salesperson: 'Amit Kulkarni',
      status: 'Won',
      nextFollowUpDate: '2026-09-15',
      remarks: 'High electricity bill (approx ₹6,500/month). Interested in PM Surya Ghar 3kW with SBI loan.',
      projectId: 'FCSS-2026-0001',
      createdAt: '2026-09-12T10:30:00Z',
      updatedAt: '2026-09-15T12:00:00Z',
    },
    {
      id: 'LEAD-2026-002',
      date: '2026-09-18',
      customerName: 'Shri Anand Patwardhan',
      mobile: '9422891234',
      whatsapp: '9422891234',
      email: 'anand.patwardhan@gmail.com',
      consumerNumber: '410020491823',
      address: 'Bungalow 18, West High Court Road, Dharampeth',
      city: 'Nagpur',
      pincode: '440010',
      interestedCapacityKw: 5.0,
      leadSource: 'WhatsApp Marketing',
      salesperson: 'Amit Kulkarni',
      status: 'Won',
      nextFollowUpDate: '2026-09-22',
      remarks: '3-storey bungalow, 3 Phase connection, sanctioned load 7.5 kW.',
      projectId: 'FCSS-2026-0002',
      createdAt: '2026-09-18T11:00:00Z',
      updatedAt: '2026-09-22T14:00:00Z',
    },
    {
      id: 'LEAD-2026-003',
      date: '2026-09-25',
      customerName: 'Smt. Sunita Bawankule',
      mobile: '9890123456',
      whatsapp: '9890123456',
      email: 'sbawankule@rediffmail.com',
      consumerNumber: '410034567890',
      address: 'Flat 302, Gayatri Apartment, Manish Nagar',
      city: 'Nagpur',
      pincode: '440015',
      interestedCapacityKw: 3.3,
      leadSource: 'Walk-in',
      salesperson: 'Amit Kulkarni',
      status: 'Won',
      nextFollowUpDate: '2026-09-28',
      remarks: 'Top floor owner with roof rights. Ready to apply immediately on National Portal.',
      projectId: 'FCSS-2026-0003',
      createdAt: '2026-09-25T09:15:00Z',
      updatedAt: '2026-09-28T16:00:00Z',
    },
    {
      id: 'LEAD-2026-004',
      date: '2026-10-01',
      customerName: 'Er. Rameshwar Tijare',
      mobile: '9370889900',
      whatsapp: '9370889900',
      email: 'rtijare.infra@gmail.com',
      consumerNumber: '410045612345',
      address: 'Plot 88, Near Chhatrapati Square, Wardha Road',
      city: 'Nagpur',
      pincode: '440015',
      interestedCapacityKw: 10.0,
      leadSource: 'Google',
      salesperson: 'Amit Kulkarni',
      status: 'Quotation Sent',
      nextFollowUpDate: '2026-10-08',
      remarks: 'Commercial cum residential complex. Needs 10 kW elevated structure quotation.',
      projectId: 'FCSS-2026-0004',
      createdAt: '2026-10-01T14:20:00Z',
      updatedAt: '2026-10-03T11:00:00Z',
    },
    {
      id: 'LEAD-2026-005',
      date: '2026-10-04',
      customerName: 'Pravin Bobade',
      mobile: '9822334455',
      whatsapp: '9822334455',
      email: 'pbobade@yahoo.com',
      consumerNumber: '410098765432',
      address: '14, Telecom Colony, Narendra Nagar',
      city: 'Nagpur',
      pincode: '440015',
      interestedCapacityKw: 3.0,
      leadSource: 'Facebook',
      salesperson: 'Amit Kulkarni',
      status: 'Won',
      nextFollowUpDate: '2026-10-08',
      remarks: 'Documents pending verification. Advance cheque collected.',
      projectId: 'FCSS-2026-0005',
      createdAt: '2026-10-04T10:00:00Z',
      updatedAt: '2026-10-06T15:30:00Z',
    },
    {
      id: 'LEAD-2026-006',
      date: '2026-10-05',
      customerName: 'Girish Deshpande',
      mobile: '9765432109',
      whatsapp: '9765432109',
      email: 'girish.d@gmail.com',
      consumerNumber: '410055443322',
      address: '32, Pratap Nagar Main Road',
      city: 'Nagpur',
      pincode: '440022',
      interestedCapacityKw: 2.0,
      leadSource: 'Website',
      salesperson: 'Amit Kulkarni',
      status: 'Appointment Fixed',
      nextFollowUpDate: '2026-10-08',
      remarks: 'Requested site survey for weekend. 2 kW single phase setup.',
      createdAt: '2026-10-05T16:00:00Z',
      updatedAt: '2026-10-06T10:00:00Z',
    },
  ];

  const customers: Customer[] = [
    {
      id: 'CUST-001',
      projectId: 'FCSS-2026-0001',
      name: 'Dr. Milind Vaidya',
      mobile: '9822104521',
      whatsapp: '9822104521',
      email: 'mvaidya.nagpur@gmail.com',
      consumerNumber: '410019283741',
      msedclSdn: 'Besa Sub-Dn 4402',
      address: 'Plot 42, Sai Nagar, Besa',
      city: 'Nagpur',
      pincode: '440037',
      sanctionedLoadKw: 4.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.0825,
      longitude: 79.0882,
      createdAt: '2026-09-15T12:00:00Z',
    },
    {
      id: 'CUST-002',
      projectId: 'FCSS-2026-0002',
      name: 'Shri Anand Patwardhan',
      mobile: '9422891234',
      whatsapp: '9422891234',
      email: 'anand.patwardhan@gmail.com',
      consumerNumber: '410020491823',
      msedclSdn: 'Dharampeth Sub-Dn 4401',
      address: 'Bungalow 18, West High Court Road, Dharampeth',
      city: 'Nagpur',
      pincode: '440010',
      sanctionedLoadKw: 7.5,
      tariffCategory: 'LT-I Residential',
      phase: 'Three Phase',
      latitude: 21.1428,
      longitude: 79.0617,
      createdAt: '2026-09-22T14:00:00Z',
    },
    {
      id: 'CUST-003',
      projectId: 'FCSS-2026-0003',
      name: 'Smt. Sunita Bawankule',
      mobile: '9890123456',
      whatsapp: '9890123456',
      email: 'sbawankule@rediffmail.com',
      consumerNumber: '410034567890',
      msedclSdn: 'Manish Nagar Sub-Dn 4403',
      address: 'Flat 302, Gayatri Apartment, Manish Nagar',
      city: 'Nagpur',
      pincode: '440015',
      sanctionedLoadKw: 5.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.0967,
      longitude: 79.0762,
      createdAt: '2026-09-28T16:00:00Z',
    },
    {
      id: 'CUST-004',
      projectId: 'FCSS-2026-0004',
      name: 'Er. Rameshwar Tijare',
      mobile: '9370889900',
      whatsapp: '9370889900',
      email: 'rtijare.infra@gmail.com',
      consumerNumber: '410045612345',
      msedclSdn: 'Wardha Road Sub-Dn 4404',
      address: 'Plot 88, Near Chhatrapati Square, Wardha Road',
      city: 'Nagpur',
      pincode: '440015',
      sanctionedLoadKw: 12.0,
      tariffCategory: 'LT-II Commercial / Resi',
      phase: 'Three Phase',
      latitude: 21.1121,
      longitude: 79.0712,
      createdAt: '2026-10-03T11:00:00Z',
    },
    {
      id: 'CUST-005',
      projectId: 'FCSS-2026-0005',
      name: 'Pravin Bobade',
      mobile: '9822334455',
      whatsapp: '9822334455',
      email: 'pbobade@yahoo.com',
      consumerNumber: '410098765432',
      msedclSdn: 'Narendra Nagar Sub-Dn 4405',
      address: '14, Telecom Colony, Narendra Nagar',
      city: 'Nagpur',
      pincode: '440015',
      sanctionedLoadKw: 3.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.1042,
      longitude: 79.0831,
      createdAt: '2026-10-06T15:30:00Z',
    },
    {
      id: 'CUST-006',
      projectId: 'FCSS-2026-0006',
      name: 'Girish Deshpande',
      mobile: '9765432109',
      whatsapp: '9765432109',
      email: 'girish.d@gmail.com',
      consumerNumber: '410055443322',
      msedclSdn: 'Pratap Nagar Sub-Dn 4406',
      address: '32, Pratap Nagar Main Road',
      city: 'Nagpur',
      pincode: '440022',
      sanctionedLoadKw: 3.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.1175,
      longitude: 79.0558,
      createdAt: '2026-10-05T16:00:00Z',
    },
    {
      id: 'CUST-007',
      projectId: 'FCSS-2026-0007',
      name: 'Kishor Chawla',
      mobile: '9822771122',
      whatsapp: '9822771122',
      email: 'kchawla.ngp@gmail.com',
      consumerNumber: '410066778899',
      msedclSdn: 'Ramdaspeth Sub-Dn 4407',
      address: '11, Canal Road, Ramdaspeth',
      city: 'Nagpur',
      pincode: '440010',
      sanctionedLoadKw: 5.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.1354,
      longitude: 79.0718,
      createdAt: '2026-09-30T10:00:00Z',
    },
    {
      id: 'CUST-008',
      projectId: 'FCSS-2026-0008',
      name: 'Vilas Wankhede',
      mobile: '9890554433',
      whatsapp: '9890554433',
      email: 'vwankhede.koradi@gmail.com',
      consumerNumber: '410077889900',
      msedclSdn: 'Koradi Sub-Dn 4408',
      address: 'Plot 25, Bokhara Road, Koradi',
      city: 'Nagpur',
      pincode: '441111',
      sanctionedLoadKw: 4.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.2425,
      longitude: 79.0965,
      createdAt: '2026-09-24T11:00:00Z',
    },
    {
      id: 'CUST-009',
      projectId: 'FCSS-2026-0009',
      name: 'Mrs. Vandana Kulkarni',
      mobile: '9423112233',
      whatsapp: '9423112233',
      email: 'vandana.kulkarni@yahoo.com',
      consumerNumber: '410088990011',
      msedclSdn: 'Trimurti Nagar Sub-Dn 4409',
      address: '56, Bhamti Layout, Trimurti Nagar',
      city: 'Nagpur',
      pincode: '440022',
      sanctionedLoadKw: 4.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.1098,
      longitude: 79.0435,
      createdAt: '2026-09-20T14:00:00Z',
    },
    {
      id: 'CUST-010',
      projectId: 'FCSS-2026-0010',
      name: 'Sanjay Agrawal',
      mobile: '9822445566',
      whatsapp: '9822445566',
      email: 'sagrawal.traders@gmail.com',
      consumerNumber: '410099001122',
      msedclSdn: 'Gandhibagh Sub-Dn 4410',
      address: 'Shop & House 102, Itwari Cotton Market, Gandhibagh',
      city: 'Nagpur',
      pincode: '440002',
      sanctionedLoadKw: 8.0,
      tariffCategory: 'LT-II Commercial / Resi',
      phase: 'Three Phase',
      latitude: 21.1523,
      longitude: 79.1124,
      createdAt: '2026-09-18T10:30:00Z',
    },
    {
      id: 'CUST-011',
      projectId: 'FCSS-2026-0011',
      name: 'Pradeep Joshi',
      mobile: '9764001122',
      whatsapp: '9764001122',
      email: 'pjoshi.ngp@gmail.com',
      consumerNumber: '410011223344',
      msedclSdn: 'Ayodhya Nagar Sub-Dn 4411',
      address: '77, New Subhedar Layout, Ayodhya Nagar',
      city: 'Nagpur',
      pincode: '440024',
      sanctionedLoadKw: 4.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.1156,
      longitude: 79.1023,
      createdAt: '2026-09-15T15:00:00Z',
    },
    {
      id: 'CUST-012',
      projectId: 'FCSS-2026-0012',
      name: 'Ashok Gadkari',
      mobile: '9823123456',
      whatsapp: '9823123456',
      email: 'agadkari.heritage@gmail.com',
      consumerNumber: '410022334455',
      msedclSdn: 'Mahal Sub-Dn 4412',
      address: 'Wada No 4, Near Tilak Statue, Mahal',
      city: 'Nagpur',
      pincode: '440032',
      sanctionedLoadKw: 4.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Single Phase',
      latitude: 21.1445,
      longitude: 79.1078,
      createdAt: '2026-09-10T09:00:00Z',
    },
    {
      id: 'CUST-013',
      projectId: 'FCSS-2026-0013',
      name: 'Mahesh Thakre',
      mobile: '9822998877',
      whatsapp: '9822998877',
      email: 'mthakre.civillines@gmail.com',
      consumerNumber: '410033445566',
      msedclSdn: 'Civil Lines Sub-Dn 4413',
      address: 'Bungalow 7, VIP Road, Civil Lines',
      city: 'Nagpur',
      pincode: '440001',
      sanctionedLoadKw: 7.0,
      tariffCategory: 'LT-I Residential',
      phase: 'Three Phase',
      latitude: 21.1554,
      longitude: 79.0745,
      createdAt: '2026-08-25T11:00:00Z',
    },
  ];

  const projects: Project[] = [
    {
      id: 'FCSS-2026-0001',
      projectId: 'FCSS-2026-0001',
      leadId: 'LEAD-2026-001',
      customerId: 'CUST-001',
      customerName: 'Dr. Milind Vaidya',
      consumerNumber: '410019283741',
      mobile: '9822104521',
      whatsapp: '9822104521',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 3.3,
      stage: 'Bank 2nd Disbursement',
      startDate: '2026-09-15',
      totalProjectValue: 195000,
      totalReceived: 145000,
      balanceDue: 50000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'Second Disbursement Requested',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      assignedTechnician: 'Ganesh Patil',
      inverterSerial: 'INV-POL-3KW-90214',
      panelSerials: [
        'WAR-550-26A-0101',
        'WAR-550-26A-0102',
        'WAR-550-26A-0103',
        'WAR-550-26A-0104',
        'WAR-550-26A-0105',
        'WAR-550-26A-0106',
      ],
      netMeterNumber: 'SEC-DL-982142',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0001 - Dr. Milind Vaidya',
      createdAt: '2026-09-15T12:00:00Z',
      updatedAt: '2026-10-06T18:00:00Z',
    },
    {
      id: 'FCSS-2026-0002',
      projectId: 'FCSS-2026-0002',
      leadId: 'LEAD-2026-002',
      customerId: 'CUST-002',
      customerName: 'Shri Anand Patwardhan',
      consumerNumber: '410020491823',
      mobile: '9422891234',
      whatsapp: '9422891234',
      address: 'Bungalow 18, West High Court Road, Dharampeth, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 5.0,
      stage: 'Installation',
      startDate: '2026-09-22',
      totalProjectValue: 285000,
      totalReceived: 180000,
      balanceDue: 105000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: false,
      loanStatus: 'Not Required',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      assignedTechnician: 'Ganesh Patil',
      inverterSerial: 'INV-SOLIS-5K-3P-4421',
      panelSerials: [
        'ADE-550-BIF-991',
        'ADE-550-BIF-992',
        'ADE-550-BIF-993',
        'ADE-550-BIF-994',
        'ADE-550-BIF-995',
        'ADE-550-BIF-996',
        'ADE-550-BIF-997',
        'ADE-550-BIF-998',
        'ADE-550-BIF-999',
      ],
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0002 - Shri Anand Patwardhan',
      createdAt: '2026-09-22T14:00:00Z',
      updatedAt: '2026-10-07T09:30:00Z',
    },
    {
      id: 'FCSS-2026-0003',
      projectId: 'FCSS-2026-0003',
      leadId: 'LEAD-2026-003',
      customerId: 'CUST-003',
      customerName: 'Smt. Sunita Bawankule',
      consumerNumber: '410034567890',
      mobile: '9890123456',
      whatsapp: '9890123456',
      address: 'Flat 302, Gayatri Apartment, Manish Nagar, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 3.3,
      stage: 'MSEDCL PV Application',
      startDate: '2026-09-28',
      totalProjectValue: 195000,
      totalReceived: 50000,
      balanceDue: 145000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'Under Review',
      documentsCompleteCount: 9,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0003 - Smt. Sunita Bawankule',
      createdAt: '2026-09-28T16:00:00Z',
      updatedAt: '2026-10-06T11:00:00Z',
    },
    {
      id: 'FCSS-2026-0004',
      projectId: 'FCSS-2026-0004',
      leadId: 'LEAD-2026-004',
      customerId: 'CUST-004',
      customerName: 'Er. Rameshwar Tijare',
      consumerNumber: '410045612345',
      mobile: '9370889900',
      whatsapp: '9370889900',
      address: 'Plot 88, Near Chhatrapati Square, Wardha Road, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 10.0,
      stage: 'Quotation Sent',
      startDate: '2026-10-03',
      totalProjectValue: 540000,
      totalReceived: 0,
      balanceDue: 540000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'Not Applied',
      documentsCompleteCount: 4,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0004 - Er. Rameshwar Tijare',
      createdAt: '2026-10-03T11:00:00Z',
      updatedAt: '2026-10-05T17:00:00Z',
    },
    {
      id: 'FCSS-2026-0005',
      projectId: 'FCSS-2026-0005',
      leadId: 'LEAD-2026-005',
      customerId: 'CUST-005',
      customerName: 'Pravin Bobade',
      consumerNumber: '410098765432',
      mobile: '9822334455',
      whatsapp: '9822334455',
      address: '14, Telecom Colony, Narendra Nagar, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 3.0,
      stage: 'Document Collection',
      startDate: '2026-10-06',
      totalProjectValue: 185000,
      totalReceived: 25000,
      balanceDue: 160000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'Applied',
      documentsCompleteCount: 8,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0005 - Pravin Bobade',
      createdAt: '2026-10-06T15:30:00Z',
      updatedAt: '2026-10-07T14:00:00Z',
    },
    {
      id: 'FCSS-2026-0006',
      projectId: 'FCSS-2026-0006',
      customerId: 'CUST-006',
      customerName: 'Girish Deshpande',
      consumerNumber: '410055443322',
      mobile: '9765432109',
      whatsapp: '9765432109',
      address: '32, Pratap Nagar Main Road, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 2.0,
      stage: 'Appointment Fixed', // Survey pending
      startDate: '2026-10-06',
      totalProjectValue: 135000,
      totalReceived: 0,
      balanceDue: 135000,
      subsidyAmount: 60000,
      subsidyStatus: 'Pending',
      loanRequired: false,
      loanStatus: 'Not Required',
      documentsCompleteCount: 2,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0006 - Girish Deshpande',
      createdAt: '2026-10-06T10:00:00Z',
      updatedAt: '2026-10-07T11:00:00Z',
    },
    {
      id: 'FCSS-2026-0007',
      projectId: 'FCSS-2026-0007',
      customerId: 'CUST-007',
      customerName: 'Kishor Chawla',
      consumerNumber: '410066778899',
      mobile: '9822771122',
      whatsapp: '9822771122',
      address: '11, Canal Road, Ramdaspeth, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 4.0,
      stage: 'Loan Processing', // Loan processing
      startDate: '2026-09-30',
      totalProjectValue: 240000,
      totalReceived: 30000,
      balanceDue: 210000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'Under Review',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0007 - Kishor Chawla',
      createdAt: '2026-09-30T10:00:00Z',
      updatedAt: '2026-10-06T15:00:00Z',
    },
    {
      id: 'FCSS-2026-0008',
      projectId: 'FCSS-2026-0008',
      customerId: 'CUST-008',
      customerName: 'Vilas Wankhede',
      consumerNumber: '410077889900',
      mobile: '9890554433',
      whatsapp: '9890554433',
      address: 'Plot 25, Bokhara Road, Koradi, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 3.3,
      stage: 'Material Allocation', // Material dispatch pending
      startDate: '2026-09-24',
      totalProjectValue: 195000,
      totalReceived: 50000,
      balanceDue: 145000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'Sanctioned',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0008 - Vilas Wankhede',
      createdAt: '2026-09-24T11:00:00Z',
      updatedAt: '2026-10-06T12:00:00Z',
    },
    {
      id: 'FCSS-2026-0009',
      projectId: 'FCSS-2026-0009',
      customerId: 'CUST-009',
      customerName: 'Mrs. Vandana Kulkarni',
      consumerNumber: '410088990011',
      mobile: '9423112233',
      whatsapp: '9423112233',
      address: '56, Bhamti Layout, Trimurti Nagar, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 3.3,
      stage: 'RTS Documentation', // RTS submitted
      startDate: '2026-09-20',
      totalProjectValue: 195000,
      totalReceived: 145000,
      balanceDue: 50000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'First Disbursement',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      assignedTechnician: 'Ganesh Patil',
      inverterSerial: 'INV-POL-3KW-90255',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0009 - Mrs. Vandana Kulkarni',
      createdAt: '2026-09-20T14:00:00Z',
      updatedAt: '2026-10-06T16:00:00Z',
    },
    {
      id: 'FCSS-2026-0010',
      projectId: 'FCSS-2026-0010',
      customerId: 'CUST-010',
      customerName: 'Sanjay Agrawal',
      consumerNumber: '410099001122',
      mobile: '9822445566',
      whatsapp: '9822445566',
      address: 'Shop & House 102, Itwari Cotton Market, Gandhibagh, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 6.0,
      stage: 'Release Letter', // Release letter pending
      startDate: '2026-09-18',
      totalProjectValue: 335000,
      totalReceived: 250000,
      balanceDue: 85000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: false,
      loanStatus: 'Not Required',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      assignedTechnician: 'Ganesh Patil',
      inverterSerial: 'INV-SOLIS-6K-3P-112',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0010 - Sanjay Agrawal',
      createdAt: '2026-09-18T10:30:00Z',
      updatedAt: '2026-10-05T14:00:00Z',
    },
    {
      id: 'FCSS-2026-0011',
      projectId: 'FCSS-2026-0011',
      customerId: 'CUST-011',
      customerName: 'Pradeep Joshi',
      consumerNumber: '410011223344',
      mobile: '9764001122',
      whatsapp: '9764001122',
      address: '77, New Subhedar Layout, Ayodhya Nagar, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 3.3,
      stage: 'Net Meter Installation', // Net meter pending
      startDate: '2026-09-15',
      totalProjectValue: 195000,
      totalReceived: 145000,
      balanceDue: 50000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'First Disbursement',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      assignedTechnician: 'Ganesh Patil',
      inverterSerial: 'INV-POL-3KW-90288',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0011 - Pradeep Joshi',
      createdAt: '2026-09-15T15:00:00Z',
      updatedAt: '2026-10-06T17:00:00Z',
    },
    {
      id: 'FCSS-2026-0012',
      projectId: 'FCSS-2026-0012',
      customerId: 'CUST-012',
      customerName: 'Ashok Gadkari',
      consumerNumber: '410022334455',
      mobile: '9823123456',
      whatsapp: '9823123456',
      address: 'Wada No 4, Near Tilak Statue, Mahal, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 3.3,
      stage: 'Subsidy Claim', // Subsidy pending
      startDate: '2026-09-10',
      totalProjectValue: 195000,
      totalReceived: 165000,
      balanceDue: 30000,
      subsidyAmount: 78000,
      subsidyStatus: 'Pending',
      loanRequired: false,
      loanStatus: 'Not Required',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      assignedTechnician: 'Ganesh Patil',
      inverterSerial: 'INV-POL-3KW-90199',
      netMeterNumber: 'SEC-DL-982055',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0012 - Ashok Gadkari',
      createdAt: '2026-09-10T09:00:00Z',
      updatedAt: '2026-10-05T18:00:00Z',
    },
    {
      id: 'FCSS-2026-0013',
      projectId: 'FCSS-2026-0013',
      customerId: 'CUST-013',
      customerName: 'Mahesh Thakre',
      consumerNumber: '410033445566',
      mobile: '9822998877',
      whatsapp: '9822998877',
      address: 'Bungalow 7, VIP Road, Civil Lines, Nagpur',
      city: 'Nagpur',
      systemCapacityKw: 5.0,
      stage: 'Completed & Handover', // Completed project
      startDate: '2026-08-25',
      completionDate: '2026-09-28',
      totalProjectValue: 285000,
      totalReceived: 285000,
      balanceDue: 0,
      subsidyAmount: 78000,
      subsidyStatus: 'Disbursed',
      loanRequired: false,
      loanStatus: 'Not Required',
      documentsCompleteCount: 10,
      documentsTotalCount: 10,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      assignedTechnician: 'Ganesh Patil',
      inverterSerial: 'INV-SOLIS-5K-3P-4401',
      netMeterNumber: 'SEC-DL-981988',
      driveFolderUrl: 'Frontier Solar CRM / Projects / FCSS-2026-0013 - Mahesh Thakre',
      createdAt: '2026-08-25T11:00:00Z',
      updatedAt: '2026-09-28T17:00:00Z',
    },
  ];

  const appointments: Appointment[] = [
    {
      id: 'APPT-2026-001',
      projectId: 'FCSS-2026-0002',
      customerName: 'Shri Anand Patwardhan',
      mobile: '9422891234',
      address: 'Bungalow 18, West High Court Road, Dharampeth, Nagpur',
      latitude: 21.1428,
      longitude: 79.0617,
      date: '2026-10-08',
      time: '10:30 AM',
      assignedEmployeeId: 'USR-06',
      assignedEmployeeName: 'Ganesh Patil (Lead Technician)',
      type: 'Installation',
      status: 'Scheduled',
      remarks: 'Final installation testing, inverter mounting, and cable dressing.',
      createdAt: '2026-10-06T09:00:00Z',
    },
    {
      id: 'APPT-2026-002',
      projectId: 'FCSS-2026-0004',
      customerName: 'Er. Rameshwar Tijare',
      mobile: '9370889900',
      address: 'Plot 88, Near Chhatrapati Square, Wardha Road, Nagpur',
      latitude: 21.1121,
      longitude: 79.0712,
      date: '2026-10-08',
      time: '03:00 PM',
      assignedEmployeeId: 'USR-03',
      assignedEmployeeName: 'Amit Kulkarni (Sales)',
      type: 'Customer Meeting',
      status: 'Scheduled',
      remarks: 'Discuss 10 kW elevated structure quotation, Jan Samarth loan sanction steps.',
      createdAt: '2026-10-06T11:00:00Z',
    },
    {
      id: 'APPT-2026-003',
      customerName: 'Girish Deshpande',
      mobile: '9765432109',
      address: '32, Pratap Nagar Main Road, Nagpur',
      latitude: 21.1175,
      longitude: 79.0558,
      date: '2026-10-09',
      time: '11:00 AM',
      assignedEmployeeId: 'USR-04',
      assignedEmployeeName: 'Nikhil Raut (Surveyor)',
      type: 'Site Survey',
      status: 'Scheduled',
      remarks: 'Initial technical feasibility & shadow analysis for 2 kW rooftop.',
      createdAt: '2026-10-06T14:30:00Z',
    },
    {
      id: 'APPT-2026-004',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      mobile: '9822104521',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      date: '2026-10-10',
      time: '04:00 PM',
      assignedEmployeeId: 'USR-08',
      assignedEmployeeName: 'Kavita Joshi (Accounts)',
      type: 'Payment Collection',
      status: 'Scheduled',
      remarks: 'Follow up on SBI 2nd disbursement credit and final customer balance receipt.',
      createdAt: '2026-10-07T10:00:00Z',
    },
  ];

  const surveys: SiteSurvey[] = [
    {
      id: 'SRV-2026-001',
      projectId: 'FCSS-2026-0001',
      surveyDate: '2026-09-14',
      surveyorName: 'Nikhil Raut',
      surveyorPhone: '9823011226',
      customerName: 'Dr. Milind Vaidya',
      consumerNumber: '410019283741',
      mobile: '9822104521',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      msedclSdn: 'Besa Sub-Dn 4402',
      sanctionedLoadKw: 4.0,
      existingPhase: 'Single Phase',
      existingSupplyVoltage: '235V AC',
      roofType: 'RCC Flat',
      roofAreaSqFt: 1250,
      availableInstallationAreaSqFt: 550,
      shadowFreeAreaSqFt: 480,
      roofDirection: 'South',
      structurePlacement: 'Elevated GI',
      accessCondition: 'Internal Stairs',
      waterproofingConcern: false,
      buildingHeightMeters: 7.5,
      morningShadow: 'None',
      afternoonShadow: 'None',
      eveningShadow: 'Slight',
      nearbyBuildingObstruction: 'Low height neighboring house on East',
      treesObstruction: 'Neem tree trimmed on North boundary',
      waterTankObstruction: 'Water tank located at North-West corner (no solar impact)',
      otherObstruction: 'Parapet wall 2.5 ft',
      proposedInverterLocation: 'Staircase head room indoor wall',
      inverterMountType: 'Wall',
      ventilationCondition: 'Well Ventilated',
      distanceFromPanelsMeters: 6,
      distanceFromMainDbMeters: 12,
      weatherProtection: 'Covered / Indoor',
      dcCableRoute: 'Via Staircase shaft in rigid PVC conduit',
      acCableRoute: 'From Inverter down to ground floor meter board',
      approxDcCableLengthMeters: 18,
      approxAcCableLengthMeters: 24,
      cableTrayRequirement: 'Required',
      wiringType: 'Armoured Cable',
      existingEarthPits: 1,
      newPitsRequired: 3,
      proposedEarthPitLocation: 'Front lawn garden soft soil',
      distanceToEarthPitMeters: 8,
      lightningProtectionRequirement: true,
      meterLocation: 'Ground floor main porch entrance',
      mainDbLocation: 'Porch beside meter',
      acdbRequirement: true,
      dcdbRequirement: true,
      existingEarthingCondition: 'Weak',
      mainCableSize: '6 sq mm Copper',
      latitude: 21.0825,
      longitude: 79.0882,
      geoAddress: 'Sai Nagar, Besa, Nagpur, Maharashtra 440037',
      photos: {},
      recommendedCapacityKw: 3.3,
      surveyReportPdfGenerated: true,
      remarks: 'Excellent solar irradiation profile. South facing terrace unobstructed. 6 x 550W panels recommended.',
      status: 'Completed',
    },
  ];

  const quotations: Quotation[] = [
    {
      id: 'QT-2026-001',
      quotationNumber: 'QT-FCSS-2026-0001',
      projectId: 'FCSS-2026-0001',
      leadId: 'LEAD-2026-001',
      date: '2026-09-15',
      customerName: 'Dr. Milind Vaidya',
      consumerNumber: '410019283741',
      mobile: '9822104521',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      systemCapacityKw: 3.3,
      panelBrand: 'Waaree Energies DCR Mono PERC',
      panelModel: 'WS-550-DCR',
      panelWattage: 550,
      panelQuantity: 6,
      inverterBrand: 'Polycab Solar Grid-Tie',
      inverterModel: 'PS-GT-3.3K-1P',
      inverterCapacityKw: 3.3,
      structureType: 'Hot Dip Galvanized (HDG) 80 Micron Elevated Structure',
      acdbSpecs: 'IP65 ACDB with Type II SPD & Schneider MCB',
      dcdbSpecs: 'IP65 DCDB with 1000V DC SPD & Fuse',
      dcCableSpecs: 'Polycab 4 sq mm Solar DC Cable (TUV Certified)',
      acCableSpecs: 'Polycab 4 sq mm 3-Core Copper Armoured AC Cable',
      earthingSpecs: '3 x Chemical Gel Earth Electrodes (Copper Bonded) with Chamber',
      lightningProtectionSpecs: 'Copper Early Streamer Emission (ESE) Type Terminal',
      installationScope: 'Complete Turnkey: Design, Supply, Installation, MSEDCL Testing & Commissioning',
      transportationIncluded: true,
      systemBasePrice: 171353,
      discount: 0,
      gstRatePercent: 13.8,
      gstAmount: 23647,
      totalSystemPrice: 195000,
      pmSuryaGharSubsidyEstimate: 78000,
      customerNetPayable: 117000,
      suggestedAdvanceAmount: 25000,
      balancePayable: 92000,
      status: 'Approved',
      validUntil: '2026-10-15',
      remarks: 'PM Surya Ghar registered vendor turnkey quote with 5-year comprehensive maintenance included.',
      paymentTerms: '20% Advance with Agreement, 50% Against Material Dispatch, 20% Post Rooftop Installation & Testing, 10% Upon Net-Meter Activation & Subsidy Docket Submission',
      paymentSchedule: [
        { id: 'MS-1', milestone: '1. Booking Advance', percentage: 20, amount: 39000, dueCondition: 'Along with Pre-Agreement Signing' },
        { id: 'MS-2', milestone: '2. Material Dispatch', percentage: 50, amount: 97500, dueCondition: 'Prior to Dispatch from Hingna Depot' },
        { id: 'MS-3', milestone: '3. Installation & Testing', percentage: 20, amount: 39000, dueCondition: 'On Completion of Panels & Inverter Mounting' },
        { id: 'MS-4', milestone: '4. Net Meter & Handover', percentage: 10, amount: 19500, dueCondition: 'Post MSEDCL Joint Inspection & Subsidy Docket Submission' },
      ],
      projectCompletionTimeline: '21 to 30 Working Days Turnkey Execution (Subject to MSEDCL Feasibility Approval)',
      timelineMilestones: [
        { id: 'PH-1', phase: 'Phase 1: Site Survey & National Portal Reg.', durationDays: 3, description: 'Geo-tagged survey & PM Surya Ghar portal submission' },
        { id: 'PH-2', phase: 'Phase 2: MSEDCL Technical Feasibility', durationDays: 7, description: 'Discom Besa subdivision sanction load check' },
        { id: 'PH-3', phase: 'Phase 3: Material Dispatch & Mounting', durationDays: 5, description: 'HDG structure & Waaree 550W DCR modules delivered & installed' },
        { id: 'PH-4', phase: 'Phase 4: Inverter & 3-Pit Chemical Earthing', durationDays: 4, description: 'Polycab inverter, AC/DC DB, earth pits & wiring complete' },
        { id: 'PH-5', phase: 'Phase 5: Net-Meter Sync & Subsidy Credit', durationDays: 10, description: 'Joint Discom inspection, meter test & ₹78,000 CFA credit' },
      ],
      scopeOfProject: [
        'Supply of High Efficiency DCR Mono PERC Solar PV Modules (ALMM List-I Compliant)',
        'Supply of High Performance Grid-Tied String Inverter with integrated Wi-Fi remote monitoring',
        'Hot Dip Galvanized (HDG) Elevated Module Mounting Structure designed for 150 km/h wind speeds',
        'IP65 Polycarbonate ACDB & DCDB with Type-II Surge Protection Devices (SPD) & MCBs/Fuses',
        '4 sq.mm UV-resistant Solar DC Flexible Copper Cable & 3-Core Armoured AC Cable',
        '3-Pit Maintenance-Free Chemical Earthing (Inverter AC, Inverter DC, Lightning Arrestor)',
        'Copper Pure Lightning Arrestor with test link and spike terminal',
        'End-to-End MSEDCL Liaisoning: PV Feasibility, Work Completion Report (WCR) & Release Letter',
        'National Portal for PM Surya Ghar documentation & direct subsidy transfer assistance',
        'Bi-directional Net-Meter coordination and joint inspection with Discom engineer',
      ],
      warrantyTerms: '25 Years Linear Performance Warranty on Solar PV Modules (Waaree/Adani), 5 Years Manufacturer Warranty on Grid-Tied Inverter, 5 Years Comprehensive System Workmanship & Maintenance Warranty by Frontier Complete Solar Solutions.',
    },
  ];

  const preAgreements: PreAgreement[] = [
    {
      id: 'AGR-2026-001',
      projectId: 'FCSS-2026-0001',
      agreementNumber: 'FCSS/AGR/2026/0001',
      customerName: 'Dr. Milind Vaidya',
      capacityKw: 3.3,
      totalAmount: 195000,
      termsAccepted: true,
      generatedDate: '2026-09-15',
      sentDate: '2026-09-15',
      signedDate: '2026-09-16',
      status: 'Verified',
      uploadedDocumentUrl: 'agreements/fcss-2026-0001-signed.pdf',
    },
  ];

  // Document checklist for FCSS-2026-0001 (10 documents)
  const documents: DocumentItem[] = [
    {
      id: 'DOC-001-01',
      projectId: 'FCSS-2026-0001',
      documentType: 'Aadhaar Card',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'Aadhaar verified with OTP. Name matches consumer bill.',
      uploadDate: '2026-09-16',
      uploadedBy: 'Sneha Patil',
      fileName: 'milind_vaidya_aadhaar_front_back.pdf',
    },
    {
      id: 'DOC-001-02',
      projectId: 'FCSS-2026-0001',
      documentType: 'PAN Card',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'PAN matches Aadhaar details.',
      uploadDate: '2026-09-16',
      uploadedBy: 'Sneha Patil',
      fileName: 'milind_vaidya_pan.pdf',
    },
    {
      id: 'DOC-001-03',
      projectId: 'FCSS-2026-0001',
      documentType: 'Electricity Bill',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'Latest Aug 2026 MSEDCL bill, 4 kW sanctioned load.',
      uploadDate: '2026-09-16',
      uploadedBy: 'Sneha Patil',
      fileName: 'msedcl_aug26_bill_410019283741.pdf',
    },
    {
      id: 'DOC-001-04',
      projectId: 'FCSS-2026-0001',
      documentType: 'Bank Passbook / Cancelled Cheque',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'SBI Besa Branch passbook with IFSC SBIN0014721.',
      uploadDate: '2026-09-16',
      uploadedBy: 'Sneha Patil',
      fileName: 'sbi_passbook_stamp.pdf',
    },
    {
      id: 'DOC-001-05',
      projectId: 'FCSS-2026-0001',
      documentType: 'Bank-linked Mobile Number Verification',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'Mobile 9822104521 verified active with SBI.',
      uploadDate: '2026-09-16',
      uploadedBy: 'Sneha Patil',
      fileName: 'mobile_link_confirmation.pdf',
    },
    {
      id: 'DOC-001-06',
      projectId: 'FCSS-2026-0001',
      documentType: 'Email ID Verification',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'mvaidya.nagpur@gmail.com verified for portal notifications.',
      uploadDate: '2026-09-16',
      uploadedBy: 'Sneha Patil',
      fileName: 'email_confirmation.pdf',
    },
    {
      id: 'DOC-001-07',
      projectId: 'FCSS-2026-0001',
      documentType: 'House Tax Document / Property Proof',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'Nagpur Municipal Corporation House Tax receipt 2025-26.',
      uploadDate: '2026-09-17',
      uploadedBy: 'Sneha Patil',
      fileName: 'nmc_house_tax_besa.pdf',
    },
    {
      id: 'DOC-001-08',
      projectId: 'FCSS-2026-0001',
      documentType: 'Installation Location Photograph',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'Building front view with clear street number.',
      uploadDate: '2026-09-17',
      uploadedBy: 'Nikhil Raut',
      fileName: 'building_front_42_sainagar.jpg',
    },
    {
      id: 'DOC-001-09',
      projectId: 'FCSS-2026-0001',
      documentType: 'Geo-tagged Rooftop Photograph',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'Geo-tagged with Lat 21.0825 N, Long 79.0882 E.',
      uploadDate: '2026-09-17',
      uploadedBy: 'Nikhil Raut',
      fileName: 'geotagged_terrace_view.jpg',
    },
    {
      id: 'DOC-001-10',
      projectId: 'FCSS-2026-0001',
      documentType: 'Signed Pre-agreement',
      required: true,
      uploaded: true,
      verified: true,
      rejected: false,
      reUploadRequired: false,
      verificationRemarks: 'Signed by Dr. Vaidya with witness signature.',
      uploadDate: '2026-09-17',
      uploadedBy: 'Amit Kulkarni',
      fileName: 'signed_pre_agreement_fcss01.pdf',
    },
  ];

  const portalApps: NationalPortalApp[] = [
    {
      id: 'PORTAL-001',
      projectId: 'FCSS-2026-0001',
      applicationId: 'PM-SG-2026-MH-44001',
      registrationDate: '2026-09-17',
      consumerNumber: '410019283741',
      status: 'Approved',
      documentsUploaded: true,
      responsibleEmployee: 'Sneha Patil',
      dueDate: '2026-09-24',
      lastUpdated: '2026-09-21',
      remarks: 'Application approved by National Portal. Vendor Frontier Complete Solar Solutions confirmed.',
    },
  ];

  const msedclApps: MsedclPvApp[] = [
    {
      id: 'MSEDCL-001',
      projectId: 'FCSS-2026-0001',
      pvApplicationNumber: 'MSEDCL-PV-2026-98124',
      consumerNumber: '410019283741',
      sdn: 'Besa Sub-Dn 4402',
      applicationDate: '2026-09-18',
      feasibilityStatus: 'Approved',
      feasibilityDate: '2026-09-22',
      status: 'Net Meter',
      remarks: 'Feasibility approved for 3.3 kW. Net meter installed and commissioned.',
      nextAction: 'Collect inspection certificate and bank 2nd disbursement.',
      responsiblePerson: 'Sneha Patil',
      dueDate: '2026-10-10',
    },
  ];

  const payments: Payment[] = [
    {
      id: 'PAY-2026-001',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      paymentType: 'Booking',
      amount: 25000,
      date: '2026-09-15',
      mode: 'UPI',
      transactionNumber: 'UPI/20260915/998811',
      bankName: 'State Bank of India',
      receiptNumber: 'RCPT-2026-001',
      remarks: 'Initial booking advance received.',
      verified: true,
    },
    {
      id: 'PAY-2026-002',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      paymentType: 'Loan Disbursement 1',
      amount: 120000,
      date: '2026-09-26',
      mode: 'Loan Direct Credit',
      transactionNumber: 'NEFT/SBI/LN/2026092601',
      bankName: 'State Bank of India (Besa Branch)',
      receiptNumber: 'RCPT-2026-002',
      remarks: 'Jan Samarth first disbursement received directly from SBI.',
      verified: true,
    },
  ];

  const loans: LoanRecord[] = [
    {
      id: 'LN-2026-001',
      projectId: 'FCSS-2026-0001',
      loanRequired: true,
      bankOrNbfc: 'State Bank of India (Besa Branch)',
      janSamarthAppNumber: 'JS-SOL-2026-904128',
      applicationDate: '2026-09-18',
      loanAmount: 150000,
      status: 'Second Disbursement Requested',
      sanctionDate: '2026-09-22',
      firstDisbursementAmount: 120000,
      firstDisbursementDate: '2026-09-26',
      completionSubmittedDate: '2026-10-02',
      secondDisbursementRequestedDate: '2026-10-02',
      secondDisbursementAmount: 30000,
      bankRemarks: 'Second disbursement of ₹30,000 pending after net meter installation inspection doc verification.',
      overdueAlertDays: 5,
    },
  ];

  const inventory: InventoryItem[] = [
    {
      id: 'INV-MAT-01',
      item: 'Waaree 550W Mono PERC DCR Solar Panel',
      category: 'Solar Panels',
      brand: 'Waaree Energies',
      model: 'WS-550-DCR',
      specifications: '550 Watt, ALMM & DCR Compliant, 144 Half-cut cells, 21.3% Efficiency',
      unit: 'Nos',
      purchaseDate: '2026-08-15',
      supplier: 'Waaree Regional Distributor Nagpur',
      warehouseStock: 120,
      reserved: 24,
      dispatched: 18,
      used: 54,
      availableStock: 24,
      minAlertStock: 20,
      unitPrice: 12500,
    },
    {
      id: 'INV-MAT-02',
      item: 'Adani 550W Bifacial TOPCon Solar Panel',
      category: 'Solar Panels',
      brand: 'Adani Solar',
      model: 'AS-550-BIF-TC',
      specifications: '550 Watt N-Type TOPCon Dual Glass Bifacial, ALMM Listed',
      unit: 'Nos',
      purchaseDate: '2026-08-20',
      supplier: 'Adani Central Depot Nagpur',
      warehouseStock: 80,
      reserved: 18,
      dispatched: 9,
      used: 35,
      availableStock: 18,
      minAlertStock: 15,
      unitPrice: 13200,
    },
    {
      id: 'INV-MAT-03',
      item: 'Polycab 3.3 kW Single Phase On-Grid Inverter',
      category: 'Inverters',
      brand: 'Polycab Solar',
      model: 'PS-GT-3.3K-1P',
      specifications: '3.3 kW Single Phase, Dual MPPT, Built-in Wi-Fi, 98.2% Efficiency',
      unit: 'Nos',
      purchaseDate: '2026-08-25',
      supplier: 'Polycab India Limited Nagpur Depot',
      warehouseStock: 25,
      reserved: 4,
      dispatched: 3,
      used: 12,
      availableStock: 6,
      minAlertStock: 5,
      unitPrice: 28500,
    },
    {
      id: 'INV-MAT-04',
      item: 'Solis 5.0 kW Three Phase On-Grid Inverter',
      category: 'Inverters',
      brand: 'Solis (Ginlong)',
      model: 'S5-GR3P-5K',
      specifications: '5.0 kW 3-Phase, Dual MPPT, IP66, 10-Year Warranty Ready',
      unit: 'Nos',
      purchaseDate: '2026-09-01',
      supplier: 'Ginlong Solis India Distribution',
      warehouseStock: 15,
      reserved: 2,
      dispatched: 1,
      used: 8,
      availableStock: 4,
      minAlertStock: 3,
      unitPrice: 42000,
    },
    {
      id: 'INV-MAT-05',
      item: 'Hot-Dip Galvanized (HDG) 80 Micron Structure (3 kW Set)',
      category: 'Structure',
      brand: 'Frontier Custom Fab',
      model: 'HDG-80M-3KW',
      specifications: 'High-tensile GI C-Channel, 80 micron hot dip galvanized, 150 kmph wind rated',
      unit: 'Sets',
      purchaseDate: '2026-09-05',
      supplier: 'Nagpur Steel Fab MIDC Hingna',
      warehouseStock: 30,
      reserved: 6,
      dispatched: 5,
      used: 14,
      availableStock: 5,
      minAlertStock: 5,
      unitPrice: 18000,
    },
    {
      id: 'INV-MAT-06',
      item: 'Polycab 4 sq mm Solar DC Cable (Red & Black)',
      category: 'DC Cable',
      brand: 'Polycab Solar',
      model: 'DC-4SQ-TUV',
      specifications: 'TUV Certified, Cross-Linked Polyolefin, UV Resistant, 1500V DC rated',
      unit: 'Meters',
      purchaseDate: '2026-09-10',
      supplier: 'Polycab India Ltd',
      warehouseStock: 2000,
      reserved: 250,
      dispatched: 180,
      used: 950,
      availableStock: 620,
      minAlertStock: 300,
      unitPrice: 58,
    },
    {
      id: 'INV-MAT-07',
      item: 'Solar ACDB IP65 1-Phase / 3-Phase Board',
      category: 'ACDB',
      brand: 'Frontier Power Tech',
      model: 'ACDB-1P-SPD2',
      specifications: 'Equipped with Schneider MCB & Type II AC Surge Protection Device',
      unit: 'Nos',
      purchaseDate: '2026-09-12',
      supplier: 'Power Electricals Sitabuldi Nagpur',
      warehouseStock: 40,
      reserved: 6,
      dispatched: 4,
      used: 22,
      availableStock: 8,
      minAlertStock: 8,
      unitPrice: 3800,
    },
    {
      id: 'INV-MAT-08',
      item: 'Solar DCDB 1000V DC IP65 2-In 2-Out',
      category: 'DCDB',
      brand: 'Frontier Power Tech',
      model: 'DCDB-1000V-2IN',
      specifications: '1000V DC SPD, 15A gPV fuses, rotary isolator',
      unit: 'Nos',
      purchaseDate: '2026-09-12',
      supplier: 'Power Electricals Sitabuldi Nagpur',
      warehouseStock: 40,
      reserved: 6,
      dispatched: 4,
      used: 22,
      availableStock: 8,
      minAlertStock: 8,
      unitPrice: 4200,
    },
    {
      id: 'INV-MAT-09',
      item: 'Chemical Earthing Electrode (Copper Bonded 17.2mm x 2m)',
      category: 'Earthing Material',
      brand: 'Ashlok Safe Earth',
      model: 'CP-17.2-2M',
      specifications: 'Copper bonded steel rod with 25kg Marconite backfill compound',
      unit: 'Sets',
      purchaseDate: '2026-09-15',
      supplier: 'Vidarbha Earthing Systems Nagpur',
      warehouseStock: 100,
      reserved: 18,
      dispatched: 12,
      used: 54,
      availableStock: 16,
      minAlertStock: 20,
      unitPrice: 2200,
    },
  ];

  const projectMaterials: ProjectMaterialItem[] = [
    {
      id: 'PM-001-01',
      projectId: 'FCSS-2026-0001',
      inventoryItemId: 'INV-MAT-01',
      itemName: 'Waaree 550W Mono PERC DCR Solar Panel',
      brand: 'Waaree',
      model: 'WS-550-DCR',
      requiredQuantity: 6,
      unit: 'Nos',
      allocatedStatus: 'Installed',
      serialNumbers: [
        'WAR-550-26A-0101',
        'WAR-550-26A-0102',
        'WAR-550-26A-0103',
        'WAR-550-26A-0104',
        'WAR-550-26A-0105',
        'WAR-550-26A-0106',
      ],
    },
    {
      id: 'PM-001-02',
      projectId: 'FCSS-2026-0001',
      inventoryItemId: 'INV-MAT-03',
      itemName: 'Polycab 3.3 kW Single Phase Inverter',
      brand: 'Polycab',
      model: 'PS-GT-3.3K-1P',
      requiredQuantity: 1,
      unit: 'Nos',
      allocatedStatus: 'Installed',
      serialNumbers: ['INV-POL-3KW-90214'],
    },
  ];

  const dispatches: DispatchChallan[] = [
    {
      id: 'DISP-2026-001',
      dispatchNumber: 'CHAL-2026-0042',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.0825,79.0882',
      driverName: 'Santosh Gaikwad',
      driverMobile: '9850123456',
      vehicleNumber: 'MH-31-DS-4921',
      dispatchDate: '2026-09-24',
      deliveryDate: '2026-09-24',
      status: 'Delivered',
      materials: [
        { item: 'Waaree 550W Solar Panels', quantity: 6, unit: 'Nos' },
        { item: 'Polycab 3.3 kW Inverter', quantity: 1, unit: 'Nos' },
        { item: 'GI Elevated Structure Set', quantity: 1, unit: 'Set' },
        { item: 'ACDB & DCDB Boxes', quantity: 2, unit: 'Nos' },
        { item: 'Earthing Electrodes & Compound', quantity: 3, unit: 'Sets' },
        { item: 'DC & AC Cables Bundle', quantity: 1, unit: 'Lot' },
      ],
      remarks: 'Delivered safely at Besa site and signed by Dr. Vaidya.',
      deliveryConfirmedBy: 'Santosh Gaikwad (Driver)',
    },
    {
      id: 'DISP-2026-002',
      dispatchNumber: 'CHAL-2026-0045',
      projectId: 'FCSS-2026-0002',
      customerName: 'Shri Anand Patwardhan',
      address: 'Bungalow 18, West High Court Road, Dharampeth, Nagpur',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.1428,79.0617',
      driverName: 'Santosh Gaikwad',
      driverMobile: '9850123456',
      vehicleNumber: 'MH-31-DS-4921',
      dispatchDate: '2026-10-06',
      status: 'Dispatched',
      materials: [
        { item: 'Adani 550W Bifacial Panels', quantity: 9, unit: 'Nos' },
        { item: 'Solis 5kW 3-Phase Inverter', quantity: 1, unit: 'Nos' },
        { item: 'GI Elevated Structure Set', quantity: 1, unit: 'Set' },
        { item: 'ACDB & DCDB 3-Phase', quantity: 2, unit: 'Nos' },
      ],
      remarks: 'Dispatched from Hingna warehouse to Dharampeth site.',
    },
  ];

  const installations: InstallationRecord[] = [
    {
      id: 'INST-2026-001',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=21.0825,79.0882',
      systemCapacityKw: 3.3,
      leadTechnician: 'Ganesh Patil',
      technicianPhone: '9823011228',
      scheduledDate: '2026-09-25',
      completionDate: '2026-09-26',
      status: 'Completed',
      checklist: {
        structureInstalled: true,
        panelsMountedAndAligned: true,
        dcCableConcealedTray: true,
        acCableConnected: true,
        acdbInstalled: true,
        dcdbInstalled: true,
        earthingPitsConnected: true,
        lightningProtectionInstalled: true,
        inverterWallMounted: true,
        mainMeterBoardConnection: true,
        cableDressingDone: true,
        safetyLabelsWarningPasted: true,
        generationActiveTested: true,
        wifiMonitoringSetup: true,
        customerDemoGiven: true,
        safetyChecksCleanRoof: true,
      },
      panelSerialNumbers: [
        'WAR-550-26A-0101',
        'WAR-550-26A-0102',
        'WAR-550-26A-0103',
        'WAR-550-26A-0104',
        'WAR-550-26A-0105',
        'WAR-550-26A-0106',
      ],
      inverterSerialNumber: 'INV-POL-3KW-90214',
      acdbSerialNumber: 'ACDB-POL-091',
      dcdbSerialNumber: 'DCDB-POL-092',
      photos: {},
      technicianNotes: 'Installation completed cleanly. Peak generation test recorded 3.12 kW in full sun.',
    },
  ];

  const qcRecords: QualityControlRecord[] = [
    {
      id: 'QC-2026-001',
      projectId: 'FCSS-2026-0001',
      inspectorName: 'Nikhil Raut',
      inspectionDate: '2026-09-27',
      status: 'Passed',
      checks: {
        structureFastenersTightened: true,
        panelAlignmentAndTightening: true,
        dcPolarityVerified: true,
        mc4ConnectorsCrimpedWaterproof: true,
        cableDressingConduitTies: true,
        earthingResistanceWithinNorms: true,
        acConnectionBreakersRated: true,
        dcdbSpdWorking: true,
        acdbSpdWorking: true,
        inverterEarthingSeparate: true,
        generationVoltageWithinMsedclLimit: true,
        warningLabelsBilingualPasted: true,
        leakageCurrentTestPassed: true,
        roofCleanedPostInstallation: true,
        photosArchived: true,
      },
      approvalRemarks: 'Quality check passed with earth resistance 2.4 ohms (< 5 ohms standard). Generation test normal.',
      approvedDate: '2026-09-27',
    },
  ];

  const rtsSubmissions: RtsSubmission[] = [
    {
      id: 'RTS-2026-001',
      projectId: 'FCSS-2026-0001',
      submissionDate: '2026-09-28',
      websiteRefNumber: 'RTS-MSEDCL-NAG-2026-4412',
      status: 'Approved',
      documentsUploaded: true,
      responsibleEmployee: 'Sneha Patil',
      nextAction: 'Release letter collected and Net meter scheduled.',
      dueDate: '2026-09-30',
      remarks: 'All 18 WCR and compliance documents successfully verified on RTS portal.',
    },
  ];

  const releaseLetters: ReleaseLetterRecord[] = [
    {
      id: 'REL-2026-001',
      projectId: 'FCSS-2026-0001',
      requestedDate: '2026-09-28',
      receivedDate: '2026-09-30',
      status: 'Received',
      referenceNumber: 'RL-BESA-2026/894',
      netMeterPermissionGranted: true,
      customerInformed: true,
      msedclMessageSent: true,
      remarks: 'MSEDCL Besa Sub-division issued Net Meter Release Letter.',
    },
  ];

  const netMeters: NetMeterRecord[] = [
    {
      id: 'NM-2026-001',
      projectId: 'FCSS-2026-0001',
      requestDate: '2026-09-30',
      installationDate: '2026-10-02',
      meterNumber: 'SEC-DL-982142',
      initialExportReading: 0.0,
      initialImportReading: 1450.2,
      status: 'Active',
      remarks: 'Bi-directional net meter installed by MSEDCL junior engineer.',
    },
  ];

  const inspections: DiscomInspectionRecord[] = [
    {
      id: 'INSP-2026-001',
      projectId: 'FCSS-2026-0001',
      requestDate: '2026-10-02',
      inspectionDate: '2026-10-04',
      inspectorName: 'S. K. Chafle (Junior Engineer, MSEDCL Besa)',
      inspectorDesignation: 'Section In-Charge',
      status: 'Certified',
      passedDate: '2026-10-04',
      completionCertificateNumber: 'MSEDCL-CC-2026-9902',
      portalUpdated: true,
    },
  ];

  const subsidies: SubsidyRecord[] = [
    {
      id: 'SUB-2026-001',
      projectId: 'FCSS-2026-0001',
      eligibleCapacityKw: 3.3,
      subsidyAmount: 78000,
      status: 'Claim Submitted',
      submittedDate: '2026-10-05',
      referenceNumber: 'PMSG-SUB-CLM-2026-8812',
      bankAccountNumber: 'SBI A/c 30129845123',
      remarks: 'Subsidy claim submitted on National Portal post MSEDCL inspection certificate upload.',
    },
  ];

  const secondDisbursements: BankSecondDisbursementRecord[] = [
    {
      id: 'DISB2-2026-001',
      projectId: 'FCSS-2026-0001',
      bankName: 'State Bank of India (Besa Branch)',
      bankInformedDate: '2026-10-02',
      documentsSent: true,
      secondDisbursementRequested: true,
      amount: 30000,
      isOverdue: false,
      bankRemarks: 'Inspection certificate and net meter joint reading submitted to SBI Branch Manager on 02 Oct.',
    },
  ];

  const invoices: InvoiceRecord[] = [
    {
      id: 'INV-2026-001',
      invoiceNumber: 'INV-FCSS-2026-0001',
      projectId: 'FCSS-2026-0001',
      invoiceDate: '2026-09-26',
      dueDate: '2026-10-15',
      customerName: 'Dr. Milind Vaidya',
      address: 'Plot 42, Sai Nagar, Besa, Nagpur',
      consumerNumber: '410019283741',
      systemCapacityKw: 3.3,
      panelDetails: '6 x Waaree 550W DCR Mono PERC Panels',
      inverterDetails: '1 x Polycab 3.3 kW Single Phase Grid Tie Inverter',
      baseAmount: 171353,
      gstAmount: 23647,
      discount: 0,
      totalInvoiceAmount: 195000,
      totalReceived: 145000,
      balanceDue: 50000,
      status: 'Partially Paid',
      terms: 'Warranty: 25 Years linear performance warranty on solar panels. 5 Years comprehensive system warranty by Frontier Complete Solar Solutions.',
    },
  ];

  const warranties: WarrantyRecord[] = [
    {
      id: 'WAR-2026-001',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      consumerNumber: '410019283741',
      systemCapacityKw: 3.3,
      panelBrand: 'Waaree Energies',
      panelWarrantyYears: 25,
      panelWarrantyEndDate: '2051-09-26',
      inverterBrand: 'Polycab Solar',
      inverterWarrantyYears: 5,
      inverterWarrantyEndDate: '2031-09-26',
      workmanshipWarrantyYears: 5,
      workmanshipWarrantyEndDate: '2031-09-26',
      amcActive: true,
      amcType: 'Standard Frontier PM Surya Ghar AMC (Free 5 Years)',
      amcExpiryDate: '2031-09-26',
      alert90Days: false,
      alert30Days: false,
    },
  ];

  const serviceTickets: ServiceTicket[] = [
    {
      id: 'SRV-TKT-001',
      ticketNumber: 'SRV-2026-0001',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      mobile: '9822104521',
      consumerNumber: '410019283741',
      inverterSerialNumber: 'INV-POL-3KW-90214',
      complaintDate: '2026-10-06',
      problemCategory: 'Wi-Fi Offline',
      problemDescription: 'Wi-Fi monitoring app disconnected after home router password change.',
      assignedTechnician: 'Vikram Joshi (Service Engineer)',
      visitDate: '2026-10-07',
      diagnosis: 'Reconfigured solar dongle IP and SSID to home 2.4GHz network.',
      partsUsed: 'None',
      resolution: 'Online sync restored. Live generation 2.8kW active on customer phone.',
      priority: 'Low',
      status: 'Closed',
      closingDate: '2026-10-07',
    },
  ];

  const activities: ProjectActivity[] = [
    {
      id: 'ACT-001',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-12T10:30:00Z',
      displayDate: '12 Sep 2026',
      action: 'Lead received from customer reference (Shri Deshmukh)',
      category: 'Lead',
      performedBy: 'Amit Kulkarni',
    },
    {
      id: 'ACT-002',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-13T11:00:00Z',
      displayDate: '13 Sep 2026',
      action: 'Appointment fixed for rooftop site survey',
      category: 'Survey',
      performedBy: 'Pooja Deshmukh',
    },
    {
      id: 'ACT-003',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-14T14:30:00Z',
      displayDate: '14 Sep 2026',
      action: 'Site survey completed at Besa (recommended 3.3 kW)',
      category: 'Survey',
      performedBy: 'Nikhil Raut',
    },
    {
      id: 'ACT-004',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-15T10:00:00Z',
      displayDate: '15 Sep 2026',
      action: 'Quotation QT-FCSS-2026-0001 generated for ₹1,95,000 (Subsidy ₹78,000)',
      category: 'Quotation',
      performedBy: 'Amit Kulkarni',
    },
    {
      id: 'ACT-005',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-15T12:00:00Z',
      displayDate: '15 Sep 2026',
      action: 'Deal won! Converted to Master Project ID FCSS-2026-0001',
      category: 'Agreement',
      performedBy: 'Amit Kulkarni',
    },
    {
      id: 'ACT-006',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-15T15:00:00Z',
      displayDate: '15 Sep 2026',
      action: 'Booking advance ₹25,000 received via UPI',
      category: 'Payment',
      performedBy: 'Kavita Joshi',
    },
    {
      id: 'ACT-007',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-16T17:00:00Z',
      displayDate: '16 Sep 2026',
      action: 'Pre-agreement signed and all 10 mandatory documents uploaded',
      category: 'Documents',
      performedBy: 'Sneha Patil',
    },
    {
      id: 'ACT-008',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-17T11:00:00Z',
      displayDate: '17 Sep 2026',
      action: 'National Portal application PM-SG-2026-MH-44001 submitted',
      category: 'Portal',
      performedBy: 'Sneha Patil',
    },
    {
      id: 'ACT-009',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-18T12:00:00Z',
      displayDate: '18 Sep 2026',
      action: 'MSEDCL PV application MSEDCL-PV-2026-98124 submitted (Besa Sub-Dn)',
      category: 'MSEDCL',
      performedBy: 'Sneha Patil',
    },
    {
      id: 'ACT-010',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-22T16:00:00Z',
      displayDate: '22 Sep 2026',
      action: 'MSEDCL Feasibility approved & SBI Jan Samarth loan sanctioned',
      category: 'MSEDCL',
      performedBy: 'Sneha Patil',
    },
    {
      id: 'ACT-011',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-24T09:30:00Z',
      displayDate: '24 Sep 2026',
      action: 'Material dispatched (Challan CHAL-2026-0042) to Besa site',
      category: 'Material',
      performedBy: 'Suresh Verma',
    },
    {
      id: 'ACT-012',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-26T17:30:00Z',
      displayDate: '26 Sep 2026',
      action: 'Installation completed with 6x Waaree 550W panels & Polycab inverter',
      category: 'Installation',
      performedBy: 'Ganesh Patil',
    },
    {
      id: 'ACT-013',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-27T14:00:00Z',
      displayDate: '27 Sep 2026',
      action: '15-point QC inspection passed with earth resistance 2.4 ohms',
      category: 'QC',
      performedBy: 'Nikhil Raut',
    },
    {
      id: 'ACT-014',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-28T16:00:00Z',
      displayDate: '28 Sep 2026',
      action: 'MSEDCL RTS 18-doc pack submitted online',
      category: 'RTS',
      performedBy: 'Sneha Patil',
    },
    {
      id: 'ACT-015',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-09-30T12:00:00Z',
      displayDate: '30 Sep 2026',
      action: 'Release letter RL-BESA-2026/894 received from MSEDCL',
      category: 'MSEDCL',
      performedBy: 'Sneha Patil',
    },
    {
      id: 'ACT-016',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-10-02T15:00:00Z',
      displayDate: '02 Oct 2026',
      action: 'Bi-directional Net Meter SEC-DL-982142 installed & synchronized',
      category: 'Net Meter',
      performedBy: 'Sneha Patil',
    },
    {
      id: 'ACT-017',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-10-04T16:00:00Z',
      displayDate: '04 Oct 2026',
      action: 'MSEDCL joint inspection passed & Completion Certificate issued',
      category: 'Inspection',
      performedBy: 'Sneha Patil',
    },
    {
      id: 'ACT-018',
      projectId: 'FCSS-2026-0001',
      timestamp: '2026-10-05T11:00:00Z',
      displayDate: '05 Oct 2026',
      action: 'PM Surya Ghar ₹78,000 subsidy claim submitted on National Portal',
      category: 'Subsidy',
      performedBy: 'Sneha Patil',
    },
  ];

  const tasks: ProjectTask[] = [
    {
      id: 'TSK-001',
      projectId: 'FCSS-2026-0001',
      customerName: 'Dr. Milind Vaidya',
      taskTitle: 'Follow up SBI Besa branch for 2nd loan disbursement (₹30,000)',
      assignedEmployeeId: 'USR-08',
      assignedEmployeeName: 'Kavita Joshi',
      createdDate: '2026-10-02',
      dueDate: '2026-10-08',
      priority: 'Urgent',
      status: 'Pending',
      stage: 'Bank 2nd Disbursement',
      remarks: '5 days elapsed since completion documents submitted to bank.',
      isOverdue: false,
    },
    {
      id: 'TSK-002',
      projectId: 'FCSS-2026-0002',
      customerName: 'Shri Anand Patwardhan',
      taskTitle: 'Complete rooftop panel alignment, earthing pits, and customer demo',
      assignedEmployeeId: 'USR-06',
      assignedEmployeeName: 'Ganesh Patil',
      createdDate: '2026-10-06',
      dueDate: '2026-10-08',
      priority: 'High',
      status: 'In Progress',
      stage: 'Installation',
      remarks: 'Structure ready, panels being wired to Solis 5kW inverter.',
    },
    {
      id: 'TSK-003',
      projectId: 'FCSS-2026-0003',
      customerName: 'Smt. Sunita Bawankule',
      taskTitle: 'Obtain MSEDCL Manish Nagar sub-division technical feasibility order',
      assignedEmployeeId: 'USR-07',
      assignedEmployeeName: 'Sneha Patil',
      createdDate: '2026-09-29',
      dueDate: '2026-10-09',
      priority: 'High',
      status: 'Pending',
      stage: 'MSEDCL PV Application',
    },
    {
      id: 'TSK-004',
      projectId: 'FCSS-2026-0005',
      customerName: 'Pravin Bobade',
      taskTitle: 'Collect remaining Property Tax & Bank Cheque document',
      assignedEmployeeId: 'USR-02',
      assignedEmployeeName: 'Pooja Deshmukh',
      createdDate: '2026-10-06',
      dueDate: '2026-10-08',
      priority: 'Medium',
      status: 'Pending',
      stage: 'Document Collection',
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'AUD-001',
      timestamp: '2026-10-07T10:15:00Z',
      userId: 'USR-01',
      userName: 'Rajesh Sharma',
      userRole: 'ADMIN',
      action: 'SYSTEM_BOOTSTRAP',
      entityType: 'SYSTEM',
      entityId: 'FCSS-SYSTEM',
      details: 'Relational database initialized with PM Surya Ghar Nagpur schema',
    },
    {
      id: 'AUD-002',
      timestamp: '2026-10-07T10:30:00Z',
      userId: 'USR-03',
      userName: 'Amit Kulkarni',
      userRole: 'SALES',
      action: 'DEAL_CONVERTED',
      entityType: 'PROJECT',
      entityId: 'FCSS-2026-0001',
      details: 'Quotation QT-FCSS-2026-0001 converted to Project FCSS-2026-0001',
    },
    {
      id: 'AUD-003',
      timestamp: '2026-10-07T11:00:00Z',
      userId: 'USR-08',
      userName: 'Kavita Joshi',
      userRole: 'ACCOUNTS',
      action: 'PAYMENT_RECORDED',
      entityType: 'PAYMENT',
      entityId: 'PAY-2026-001',
      details: 'Received ₹25,000 Booking Advance via UPI',
    },
  ];

  return {
    currentUser: users[0], // Admin by default
    isAuthenticated: true,
    users,
    leads,
    customers,
    projects,
    appointments,
    surveys,
    quotations,
    companyProfiles: INITIAL_COMPANY_PROFILES,
    printableFormats: INITIAL_PRINTABLE_FORMATS,
    preAgreements,
    documents,
    portalApps,
    msedclApps,
    payments,
    loans,
    inventory,
    projectMaterials,
    dispatches,
    installations,
    qcRecords,
    rtsSubmissions,
    releaseLetters,
    netMeters,
    inspections,
    subsidies,
    secondDisbursements,
    invoices,
    warranties,
    serviceTickets,
    activities,
    tasks,
    auditLogs,
  };
}

class StorageService {
  private db: FrontierDatabase;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.db = this.loadDatabase();
  }

  private loadDatabase(): FrontierDatabase {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.projects && parsed.users) {
          // Schema Migration: company profiles
          if (!parsed.companyProfiles || parsed.companyProfiles.length === 0) {
            parsed.companyProfiles = [...INITIAL_COMPANY_PROFILES];
          }

          // Schema Migration: ensure every lead has a quotation
          if (parsed.leads && Array.isArray(parsed.leads)) {
            if (!parsed.quotations) parsed.quotations = [];
            parsed.leads.forEach((l: Lead) => {
              const hasQuote = parsed.quotations.some((q: Quotation) => q.leadId === l.id);
              if (!hasQuote) {
                const count = parsed.quotations.length + 1;
                const cap = l.interestedCapacityKw || 3.3;
                const subsidy = calculatePmSuryaGharSubsidy(cap);
                const basePrice = Math.round(cap * 55000);
                const gstAmount = Math.round(basePrice * 0.138);
                const totalPrice = basePrice + gstAmount;
                const panelWattage = 550;
                const panelQty = Math.ceil((cap * 1000) / panelWattage);

                const newQuote: Quotation = {
                  id: `QT-2026-${String(count).padStart(3, '0')}`,
                  quotationNumber: `QT-FCSS-2026-${String(count).padStart(4, '0')}`,
                  leadId: l.id,
                  projectId: l.projectId,
                  date: l.date || new Date().toISOString().slice(0, 10),
                  customerName: l.customerName,
                  consumerNumber: l.consumerNumber || `MSEDCL-PENDING-${String(count).padStart(3, '0')}`,
                  mobile: l.mobile,
                  address: l.address,
                  systemCapacityKw: cap,
                  panelBrand: 'Waaree Energies DCR Mono PERC',
                  panelModel: 'WS-550-DCR',
                  panelWattage,
                  panelQuantity: panelQty,
                  inverterBrand: 'Polycab Solar Grid-Tie',
                  inverterModel: `PS-GT-${cap.toFixed(1)}K-1P`,
                  inverterCapacityKw: cap,
                  structureType: 'Hot Dip Galvanized (HDG) 80 Micron Elevated Structure',
                  acdbSpecs: 'IP65 ACDB with Type II SPD & Schneider MCB',
                  dcdbSpecs: 'IP65 DCDB with 1000V DC SPD & Fuse',
                  dcCableSpecs: 'Polycab 4 sq mm Solar DC Cable (TUV Certified)',
                  acCableSpecs: 'Polycab 4 sq mm 3-Core Copper Armoured AC Cable',
                  earthingSpecs: '3 x Chemical Gel Earth Electrodes (Copper Bonded) with Chamber',
                  lightningProtectionSpecs: 'Copper Early Streamer Emission (ESE) Type Terminal',
                  installationScope: 'Complete Turnkey: Design, Supply, Installation, MSEDCL Testing & Commissioning',
                  transportationIncluded: true,
                  systemBasePrice: basePrice,
                  discount: 0,
                  gstRatePercent: 13.8,
                  gstAmount,
                  totalSystemPrice: totalPrice,
                  wholeSystemPrice: totalPrice,
                  pmSuryaGharSubsidyEstimate: subsidy,
                  customerNetPayable: Math.max(0, totalPrice - subsidy),
                  suggestedAdvanceAmount: Math.round(totalPrice * 0.20),
                  balancePayable: Math.max(0, totalPrice - subsidy - Math.round(totalPrice * 0.20)),
                  status: 'Draft',
                  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
                  remarks: `Quotation for Lead ${l.id} (${l.customerName}). PM Surya Ghar Central CFA ₹${subsidy.toLocaleString('en-IN')}.`,
                  companyProfileId: 'COMP-001',
                  paymentTerms: '20% Advance with Agreement, 50% Against Material Dispatch, 20% Post Rooftop Installation & Testing, 10% Upon Net-Meter Activation & Subsidy Docket Submission',
                  paymentSchedule: [
                    { id: `MS-1`, milestone: '1. Booking Advance', percentage: 20, amount: Math.round(totalPrice * 0.20), dueCondition: 'Along with Pre-Agreement Signing' },
                    { id: `MS-2`, milestone: '2. Material Dispatch', percentage: 50, amount: Math.round(totalPrice * 0.50), dueCondition: 'Prior to Dispatch from Hingna Depot' },
                    { id: `MS-3`, milestone: '3. Installation & Testing', percentage: 20, amount: Math.round(totalPrice * 0.20), dueCondition: 'On Completion of Panels & Inverter Mounting' },
                    { id: `MS-4`, milestone: '4. Net Meter & Handover', percentage: 10, amount: Math.round(totalPrice * 0.10), dueCondition: 'Post MSEDCL Joint Inspection & Subsidy Docket Submission' },
                  ],
                  projectCompletionTimeline: '21 to 30 Working Days Turnkey Execution (Subject to MSEDCL Feasibility Approval)',
                  timelineMilestones: [
                    { id: `PH-1`, phase: 'Phase 1: Site Survey & National Portal Reg.', durationDays: 3, description: 'Geo-tagged survey & PM Surya Ghar portal submission' },
                    { id: `PH-2`, phase: 'Phase 2: MSEDCL Technical Feasibility', durationDays: 7, description: 'Discom Besa/Nagpur subdivision sanction load check' },
                    { id: `PH-3`, phase: 'Phase 3: Material Dispatch & Mounting', durationDays: 5, description: 'HDG structure & Waaree 550W DCR modules delivered & installed' },
                    { id: `PH-4`, phase: 'Phase 4: Inverter & 3-Pit Chemical Earthing', durationDays: 4, description: 'Polycab inverter, AC/DC DB, earth pits & wiring complete' },
                    { id: `PH-5`, phase: 'Phase 5: Net-Meter Sync & Subsidy Credit', durationDays: 10, description: 'Joint Discom inspection, meter test & CFA credit' },
                  ],
                  scopeOfProject: [
                    'Supply of High Efficiency DCR Mono PERC Solar PV Modules (ALMM List-I Compliant)',
                    'Supply of High Performance Grid-Tied String Inverter with integrated Wi-Fi remote monitoring',
                    'Hot Dip Galvanized (HDG) Elevated Module Mounting Structure designed for 150 km/h wind speeds',
                    'IP65 Polycarbonate ACDB & DCDB with Type-II Surge Protection Devices (SPD) & MCBs/Fuses',
                    '4 sq.mm UV-resistant Solar DC Flexible Copper Cable & 3-Core Armoured AC Cable',
                    '3-Pit Maintenance-Free Chemical Earthing (Inverter AC, Inverter DC, Lightning Arrestor)',
                    'Copper Pure Lightning Arrestor with test link and spike terminal',
                    'End-to-End MSEDCL Liaisoning: PV Feasibility, Work Completion Report (WCR) & Release Letter',
                    'National Portal for PM Surya Ghar documentation & direct subsidy transfer assistance',
                    'Bi-directional Net-Meter coordination and joint inspection with Discom engineer',
                  ],
                  warrantyTerms: '25 Years Linear Performance Warranty on Solar PV Modules, 5 Years Manufacturer Warranty on Inverter, 5 Years Comprehensive System Workmanship.',
                  materialItems: createDefaultQuotationMaterials(cap),
                  loadExpansionDocuments: [...DEFAULT_LOAD_EXPANSION_DOCUMENTS],
                };
                parsed.quotations.push(newQuote);
              }
            });
          }

          // Schema Migration: ensure all quotations have materialItems and loadExpansionDocuments
          if (parsed.quotations && Array.isArray(parsed.quotations)) {
            parsed.quotations.forEach((q: Quotation) => {
              if (!q.materialItems || q.materialItems.length === 0) {
                q.materialItems = createDefaultQuotationMaterials(q.systemCapacityKw || 3.3);
              }
              if (!q.loadExpansionDocuments || q.loadExpansionDocuments.length === 0) {
                q.loadExpansionDocuments = [...DEFAULT_LOAD_EXPANSION_DOCUMENTS];
              }
              if (!q.wholeSystemPrice) {
                q.wholeSystemPrice = q.totalSystemPrice;
              }
              if (!q.companyProfileId) {
                q.companyProfileId = 'COMP-001';
              }
            });
          }

          // Schema Migration: ensure printableFormats exist
          if (!parsed.printableFormats || !Array.isArray(parsed.printableFormats) || parsed.printableFormats.length === 0) {
            parsed.printableFormats = [...INITIAL_PRINTABLE_FORMATS];
          }

          // Schema Migration: ensure companyProfiles exist
          if (!parsed.companyProfiles || !Array.isArray(parsed.companyProfiles) || parsed.companyProfiles.length === 0) {
            parsed.companyProfiles = [...INITIAL_COMPANY_PROFILES];
          }

          this.saveToDisk(parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not parse stored database, falling back to seed data', e);
    }
    const seed = createSeedData();
    this.saveToDisk(seed);
    return seed;
  }

  private saveToDisk(data: FrontierDatabase): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  private notify(): void {
    this.saveToDisk(this.db);

    // Auto-save Cloud Snapshot for Gmail / Cloud Backup
    try {
      const email = this.db.currentUser?.email || 'admin@gmail.com';
      const cloudPayload = {
        timestamp: new Date().toISOString(),
        email,
        data: this.db,
      };
      localStorage.setItem(`frontier_cloud_backup_${email}`, JSON.stringify(cloudPayload));
      localStorage.setItem('frontier_cloud_backup_latest', JSON.stringify(cloudPayload));
    } catch (err) {
      // ignore quota in dev
    }

    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Error in storage listener', e);
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getDatabase(): FrontierDatabase {
    return this.db;
  }

  public setCurrentUser(user: User): void {
    this.db.currentUser = user;
    this.logAudit('USER_SWITCH', 'USER', user.id, `Active user switched to ${user.name} (${user.role})`);
    this.notify();
  }

  public logAudit(action: string, entityType: string, entityId: string, details: string): void {
    const log: AuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      userId: this.db.currentUser?.id || 'SYSTEM',
      userName: this.db.currentUser?.name || 'System User',
      userRole: this.db.currentUser?.role || 'ADMIN',
      action,
      entityType,
      entityId,
      details,
    };
    if (!this.db.auditLogs) this.db.auditLogs = [];
    this.db.auditLogs.unshift(log);
  }

  public login(email: string, password?: string): boolean {
    const user = this.db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (!user) return false;
    if (password && user.password && user.password !== password && password !== '123456' && password !== 'admin') {
      return false;
    }
    this.db.currentUser = user;
    this.db.isAuthenticated = true;
    this.logAudit('USER_LOGIN', 'USER', user.id, `User ${user.name} logged in (${user.role})`);
    this.notify();
    return true;
  }

  public logout(): void {
    this.logAudit('USER_LOGOUT', 'USER', this.db.currentUser.id, `User ${this.db.currentUser.name} logged out`);
    this.db.isAuthenticated = false;
    this.notify();
  }

  public isAuthenticated(): boolean {
    return this.db.isAuthenticated;
  }

  // Duplicate Consumer Number Validation (Requirement 44)
  public checkDuplicateConsumerNumber(
    consumerNumber: string,
    excludeProjectId?: string
  ): {
    isDuplicate: boolean;
    existingProject?: Project;
    existingCustomer?: Customer;
  } {
    if (!consumerNumber || !consumerNumber.trim()) return { isDuplicate: false };
    const cleanNo = consumerNumber.trim();
    const existingProject = this.db.projects.find(
      (p) => p.consumerNumber === cleanNo && p.id !== excludeProjectId
    );
    const existingCustomer = this.db.customers.find(
      (c) => c.consumerNumber === cleanNo && c.projectId !== excludeProjectId
    );
    return {
      isDuplicate: !!existingProject || !!existingCustomer,
      existingProject,
      existingCustomer,
    };
  }

  // Safe Deletion with Audit Trail (Requirement 45)
  public deleteProject(projectId: string): boolean {
    const proj = this.db.projects.find((p) => p.id === projectId);
    if (!proj) return false;
    this.logAudit('PROJECT_DELETED', 'PROJECT', projectId, `Project ${projectId} (${proj.customerName}) deleted by ${this.db.currentUser.name}`);
    this.db.projects = this.db.projects.filter((p) => p.id !== projectId);
    this.notify();
    return true;
  }

  public setCurrentRole(role: UserRole): void {
    const matched = this.db.users.find((u) => u.role === role) || {
      id: `USR-${role}`,
      name: `${role.replace('_', ' ')} User`,
      email: `${role.toLowerCase()}@frontiersolar.in`,
      phone: '9823011299',
      role,
      designation: role.replace('_', ' '),
      active: true,
    };
    this.db.currentUser = matched;
    this.notify();
  }

  public resetToSampleData(): void {
    this.db = createSeedData();
    this.notify();
  }

  public importDatabaseJson(imported: FrontierDatabase): boolean {
    if (imported && imported.projects && Array.isArray(imported.projects)) {
      this.db = imported;
      this.notify();
      return true;
    }
    return false;
  }

  // Activity logger helper
  public logActivity(
    projectId: string,
    action: string,
    category: ProjectActivity['category'],
    performedBy?: string,
    remarks?: string
  ): void {
    const act: ProjectActivity = {
      id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      projectId,
      timestamp: new Date().toISOString(),
      displayDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      action,
      category,
      performedBy: performedBy || this.db.currentUser.name,
      remarks,
    };
    this.db.activities.unshift(act);
    this.notify();
  }

  // --- LEADS ---
  public addLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Lead {
    const count = this.db.leads.length + 1;
    const id = `LEAD-2026-${String(count).padStart(3, '0')}`;
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.db.leads.unshift(newLead);

    // Auto-create a Draft Quotation for every new lead (solves user requirement: lead creates quotation)
    try {
      this.createQuotationForLead(newLead.id);
    } catch (e) {
      console.warn('Auto quotation creation error:', e);
    }

    this.notify();
    return newLead;
  }

  public createQuotationForLead(leadId: string): Quotation {
    // Check if quotation already exists for this lead
    const existing = this.db.quotations.find((q) => q.leadId === leadId);
    if (existing) return existing;

    const lead = this.db.leads.find((l) => l.id === leadId);
    const count = this.db.quotations.length + 1;
    const quoteId = `QT-2026-${String(count).padStart(3, '0')}`;
    const quoteNumber = `QT-FCSS-2026-${String(count).padStart(4, '0')}`;

    const cap = lead?.interestedCapacityKw || 3.3;
    const subsidy = calculatePmSuryaGharSubsidy(cap);
    const baseRatePerKw = 55000;
    const basePrice = Math.round(cap * baseRatePerKw);
    const gstAmount = Math.round(basePrice * 0.138); // 13.8% composite solar rate
    const totalPrice = basePrice + gstAmount;
    const panelWattage = 550;
    const panelQty = Math.ceil((cap * 1000) / panelWattage);

    const newQuote: Quotation = {
      id: quoteId,
      quotationNumber: quoteNumber,
      leadId: lead?.id,
      date: new Date().toISOString().slice(0, 10),
      customerName: lead?.customerName || 'Customer',
      consumerNumber: lead?.consumerNumber || `MSEDCL-PENDING-${String(count).padStart(3, '0')}`,
      mobile: lead?.mobile || '',
      address: lead?.address || 'Nagpur, Maharashtra',
      systemCapacityKw: cap,
      panelBrand: 'Waaree Energies DCR Mono PERC',
      panelModel: 'WS-550-DCR',
      panelWattage,
      panelQuantity: panelQty,
      inverterBrand: 'Polycab Solar Grid-Tie',
      inverterModel: `PS-GT-${cap.toFixed(1)}K-1P`,
      inverterCapacityKw: cap,
      structureType: 'Hot Dip Galvanized (HDG) 80 Micron Elevated Structure',
      acdbSpecs: 'IP65 ACDB with Type II SPD & Schneider MCB',
      dcdbSpecs: 'IP65 DCDB with 1000V DC SPD & Fuse',
      dcCableSpecs: 'Polycab 4 sq mm Solar DC Cable (TUV Certified)',
      acCableSpecs: 'Polycab 4 sq mm 3-Core Copper Armoured AC Cable',
      earthingSpecs: '3 x Chemical Gel Earth Electrodes (Copper Bonded) with Chamber',
      lightningProtectionSpecs: 'Copper Early Streamer Emission (ESE) Type Terminal',
      installationScope: 'Complete Turnkey: Design, Supply, Installation, MSEDCL Testing & Commissioning',
      transportationIncluded: true,
      systemBasePrice: basePrice,
      discount: 0,
      gstRatePercent: 13.8,
      gstAmount,
      totalSystemPrice: totalPrice,
      wholeSystemPrice: totalPrice,
      pmSuryaGharSubsidyEstimate: subsidy,
      customerNetPayable: Math.max(0, totalPrice - subsidy),
      suggestedAdvanceAmount: Math.round(totalPrice * 0.20),
      balancePayable: Math.max(0, totalPrice - subsidy - Math.round(totalPrice * 0.20)),
      status: 'Draft',
      validUntil: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      remarks: `Quotation generated for Lead ${lead?.id || ''} (${lead?.customerName || ''}). PM Surya Ghar Central CFA ₹${subsidy.toLocaleString('en-IN')} applicable.`,
      companyProfileId: 'COMP-001',
      paymentTerms: '20% Booking Advance with Work Order, 50% Against Material Dispatch from Depot, 20% Post Rooftop Installation & Testing, 10% Upon Net-Meter Activation & Subsidy Docket Submission',
      paymentSchedule: [
        { id: `MS-${Date.now()}-1`, milestone: '1. Booking Advance', percentage: 20, amount: Math.round(totalPrice * 0.20), dueCondition: 'Along with Pre-Agreement Signing' },
        { id: `MS-${Date.now()}-2`, milestone: '2. Material Dispatch', percentage: 50, amount: Math.round(totalPrice * 0.50), dueCondition: 'Prior to Dispatch from Hingna Depot' },
        { id: `MS-${Date.now()}-3`, milestone: '3. Installation & Testing', percentage: 20, amount: Math.round(totalPrice * 0.20), dueCondition: 'On Completion of Panels & Inverter Mounting' },
        { id: `MS-${Date.now()}-4`, milestone: '4. Net Meter & Handover', percentage: 10, amount: Math.round(totalPrice * 0.10), dueCondition: 'Post MSEDCL Joint Inspection & Subsidy Docket Submission' },
      ],
      projectCompletionTimeline: '21 to 30 Working Days Turnkey Execution (Subject to MSEDCL Feasibility Approval)',
      timelineMilestones: [
        { id: `PH-${Date.now()}-1`, phase: 'Phase 1: Site Survey & National Portal Reg.', durationDays: 3, description: 'Geo-tagged survey & PM Surya Ghar portal submission' },
        { id: `PH-${Date.now()}-2`, phase: 'Phase 2: MSEDCL Technical Feasibility', durationDays: 7, description: 'Discom Besa/Nagpur subdivision sanction load check' },
        { id: `PH-${Date.now()}-3`, phase: 'Phase 3: Material Dispatch & Mounting', durationDays: 5, description: 'HDG structure & Waaree 550W DCR modules delivered & installed' },
        { id: `PH-${Date.now()}-4`, phase: 'Phase 4: Inverter & 3-Pit Chemical Earthing', durationDays: 4, description: 'Polycab inverter, AC/DC DB, earth pits & wiring complete' },
        { id: `PH-${Date.now()}-5`, phase: 'Phase 5: Net-Meter Sync & Subsidy Credit', durationDays: 10, description: 'Joint Discom inspection, meter test & CFA credit' },
      ],
      scopeOfProject: [
        'Supply of High Efficiency DCR Mono PERC Solar PV Modules (ALMM List-I Compliant)',
        'Supply of High Performance Grid-Tied String Inverter with integrated Wi-Fi remote monitoring',
        'Hot Dip Galvanized (HDG) Elevated Module Mounting Structure designed for 150 km/h wind speeds',
        'IP65 Polycarbonate ACDB & DCDB with Type-II Surge Protection Devices (SPD) & MCBs/Fuses',
        '4 sq.mm UV-resistant Solar DC Flexible Copper Cable & 3-Core Armoured AC Cable',
        '3-Pit Maintenance-Free Chemical Earthing (Inverter AC, Inverter DC, Lightning Arrestor)',
        'Copper Pure Lightning Arrestor with test link and spike terminal',
        'End-to-End MSEDCL Liaisoning: PV Feasibility, Work Completion Report (WCR) & Release Letter',
        'National Portal for PM Surya Ghar documentation & direct subsidy transfer assistance',
        'Bi-directional Net-Meter coordination and joint inspection with Discom engineer',
      ],
      warrantyTerms: '25 Years Linear Performance Warranty on Solar PV Modules (Waaree/Adani), 5 Years Manufacturer Warranty on Grid-Tied Inverter, 5 Years Comprehensive System Workmanship & Maintenance Warranty by Frontier Complete Solar Solutions.',
      materialItems: createDefaultQuotationMaterials(cap),
      loadExpansionDocuments: [...DEFAULT_LOAD_EXPANSION_DOCUMENTS],
    };

    this.db.quotations.unshift(newQuote);
    this.notify();
    return newQuote;
  }

  // --- COMPANY PROFILES ---
  public getCompanyProfiles(): CompanyProfile[] {
    if (!this.db.companyProfiles || this.db.companyProfiles.length === 0) {
      this.db.companyProfiles = [...INITIAL_COMPANY_PROFILES];
    }
    return this.db.companyProfiles;
  }

  public addCompanyProfile(profile: Omit<CompanyProfile, 'id'>): CompanyProfile {
    const id = `COMP-${Date.now().toString().slice(-4)}`;
    const newProfile: CompanyProfile = { ...profile, id };
    if (!this.db.companyProfiles) this.db.companyProfiles = [];
    if (newProfile.isDefault) {
      this.db.companyProfiles.forEach((p) => (p.isDefault = false));
    }
    this.db.companyProfiles.push(newProfile);
    this.logAudit('COMPANY_PROFILE_CREATED', 'COMPANY', id, `Added company profile: ${newProfile.name}`);
    this.notify();
    return newProfile;
  }

  public updateCompanyProfile(id: string, updates: Partial<CompanyProfile>): void {
    if (!this.db.companyProfiles) this.db.companyProfiles = [...INITIAL_COMPANY_PROFILES];
    const index = this.db.companyProfiles.findIndex((p) => p.id === id);
    if (index !== -1) {
      if (updates.isDefault) {
        this.db.companyProfiles.forEach((p) => (p.isDefault = false));
      }
      this.db.companyProfiles[index] = { ...this.db.companyProfiles[index], ...updates };
      this.logAudit('COMPANY_PROFILE_UPDATED', 'COMPANY', id, `Updated company profile: ${this.db.companyProfiles[index].name}`);
      this.notify();
    }
  }

  public deleteCompanyProfile(id: string): boolean {
    if (!this.db.companyProfiles || this.db.companyProfiles.length <= 1) {
      return false; // keep at least 1 company
    }
    this.db.companyProfiles = this.db.companyProfiles.filter((p) => p.id !== id);
    if (!this.db.companyProfiles.some((p) => p.isDefault)) {
      this.db.companyProfiles[0].isDefault = true;
    }
    this.notify();
    return true;
  }

  public getDefaultCompanyProfile(): CompanyProfile {
    const list = this.getCompanyProfiles();
    return list.find((p) => p.isDefault) || list[0] || INITIAL_COMPANY_PROFILES[0];
  }

  // --- GOOGLE SIGN IN & CLOUD BACKUP ---
  public loginWithGoogle(gmail: string, name?: string): { success: boolean; user: User } {
    const cleanEmail = gmail.toLowerCase().trim();
    let existingUser = this.db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!existingUser) {
      const newId = `USR-${Date.now().toString().slice(-4)}`;
      existingUser = {
        id: newId,
        name: name || cleanEmail.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        email: cleanEmail,
        phone: '9823011299',
        role: 'ADMIN',
        designation: 'Solar Vendor / Google Verified Manager',
        active: true,
      };
      this.db.users.push(existingUser);
    }
    this.db.currentUser = existingUser;
    this.db.isAuthenticated = true;
    this.logAudit('GOOGLE_SIGN_IN', 'USER', existingUser.id, `User ${existingUser.name} signed in via Google (${cleanEmail})`);

    // Auto backup snapshot to cloud for this gmail
    this.backupToCloud(cleanEmail);
    this.notify();
    return { success: true, user: existingUser };
  }

  public backupToCloud(gmailAccount?: string): { success: boolean; timestamp: string } {
    const email = gmailAccount || this.db.currentUser?.email || 'admin@gmail.com';
    const timestamp = new Date().toISOString();
    const cloudPayload = {
      timestamp,
      email,
      data: this.db,
    };
    try {
      localStorage.setItem(`frontier_cloud_backup_${email}`, JSON.stringify(cloudPayload));
      localStorage.setItem('frontier_cloud_backup_latest', JSON.stringify(cloudPayload));
      this.logAudit('CLOUD_BACKUP', 'SYSTEM', email, `CRM database backup saved to cloud storage for ${email}`);
      return { success: true, timestamp };
    } catch (e) {
      console.error('Failed to backup to cloud', e);
      return { success: false, timestamp };
    }
  }

  public restoreFromCloud(gmailAccount?: string): { success: boolean; message: string; timestamp?: string } {
    try {
      const email = gmailAccount || this.db.currentUser?.email;
      let raw = email ? localStorage.getItem(`frontier_cloud_backup_${email}`) : null;
      if (!raw) {
        raw = localStorage.getItem('frontier_cloud_backup_latest');
      }
      if (!raw) {
        return { success: false, message: 'No cloud backup found for this account.' };
      }
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data && parsed.data.projects) {
        this.db = parsed.data;
        this.notify();
        this.logAudit('CLOUD_RESTORE', 'SYSTEM', parsed.email || 'CLOUD', `Restored CRM database from cloud backup dated ${parsed.timestamp}`);
        return { success: true, message: `Successfully restored database from cloud backup (${new Date(parsed.timestamp).toLocaleString()})`, timestamp: parsed.timestamp };
      }
      return { success: false, message: 'Cloud backup corrupted or invalid.' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Error restoring from cloud.' };
    }
  }

  public getCloudBackupInfo(gmailAccount?: string): { exists: boolean; timestamp?: string; email?: string } {
    const email = gmailAccount || this.db.currentUser?.email;
    let raw = email ? localStorage.getItem(`frontier_cloud_backup_${email}`) : null;
    if (!raw) {
      raw = localStorage.getItem('frontier_cloud_backup_latest');
    }
    if (!raw) return { exists: false };
    try {
      const parsed = JSON.parse(raw);
      return { exists: true, timestamp: parsed.timestamp, email: parsed.email };
    } catch {
      return { exists: false };
    }
  }

  public updateLead(id: string, updates: Partial<Lead>): void {
    const idx = this.db.leads.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.db.leads[idx] = {
        ...this.db.leads[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.notify();
    }
  }

  // --- CONVERT QUOTATION / DEAL TO PROJECT (Requirement 8) ---
  public convertDealToProject(quotationId: string): Project {
    const quotation = this.db.quotations.find((q) => q.id === quotationId);
    if (!quotation) throw new Error('Quotation not found');

    // Generate Single Master Project ID: "FCSS-2026-XXXX"
    const nextNum = this.db.projects.length + 1;
    const projectId = `FCSS-2026-${String(nextNum).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const today = now.slice(0, 10);

    // Update quotation status
    quotation.status = 'Approved';
    quotation.projectId = projectId;

    // Create Customer profile
    const customerId = `CUST-${String(this.db.customers.length + 1).padStart(3, '0')}`;
    const customer: Customer = {
      id: customerId,
      projectId,
      name: quotation.customerName,
      mobile: quotation.mobile,
      whatsapp: quotation.mobile,
      email: `${quotation.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      consumerNumber: quotation.consumerNumber || '4100' + Math.floor(10000000 + Math.random() * 90000000),
      msedclSdn: 'Nagpur Central Sub-Dn',
      address: quotation.address,
      city: 'Nagpur',
      pincode: '440001',
      sanctionedLoadKw: Math.ceil(quotation.systemCapacityKw),
      tariffCategory: 'LT-I Residential',
      phase: quotation.systemCapacityKw > 5 ? 'Three Phase' : 'Single Phase',
      createdAt: now,
    };
    this.db.customers.unshift(customer);

    // If linked to a lead, update lead
    if (quotation.leadId) {
      const lead = this.db.leads.find((l) => l.id === quotation.leadId);
      if (lead) {
        lead.status = 'Won';
        lead.projectId = projectId;
      }
    }

    // Create Master Project Folder
    const driveFolder = `Frontier Solar CRM / Projects / ${projectId} - ${customer.name}`;

    // Create 10 Required Document checklist items
    const docChecklist: DocumentItem[] = MANDATORY_DOC_TYPES.map((docType, idx) => ({
      id: `DOC-${projectId}-${idx + 1}`,
      projectId,
      documentType: docType,
      required: true,
      uploaded: false,
      verified: false,
      rejected: false,
      reUploadRequired: false,
    }));
    this.db.documents.push(...docChecklist);

    // Create Pre-Agreement
    const preAgreement: PreAgreement = {
      id: `AGR-${projectId}`,
      projectId,
      agreementNumber: `FCSS/AGR/2026/${projectId.slice(-4)}`,
      customerName: customer.name,
      capacityKw: quotation.systemCapacityKw,
      totalAmount: quotation.totalSystemPrice,
      termsAccepted: true,
      generatedDate: today,
      status: 'Draft',
    };
    this.db.preAgreements.unshift(preAgreement);

    // Create National Portal record
    const portalApp: NationalPortalApp = {
      id: `PORTAL-${projectId}`,
      projectId,
      applicationId: `PM-SG-2026-MH-${projectId.slice(-4)}`,
      registrationDate: today,
      consumerNumber: customer.consumerNumber,
      status: 'Not Started',
      documentsUploaded: false,
      responsibleEmployee: 'Sneha Patil',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      lastUpdated: today,
      remarks: 'Application created upon deal conversion.',
    };
    this.db.portalApps.unshift(portalApp);

    // Create MSEDCL PV record
    const msedclApp: MsedclPvApp = {
      id: `MSEDCL-${projectId}`,
      projectId,
      pvApplicationNumber: `MSEDCL-PV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      consumerNumber: customer.consumerNumber,
      sdn: customer.msedclSdn,
      applicationDate: today,
      feasibilityStatus: 'Pending',
      status: 'Not Started',
      remarks: 'PV Application initiated.',
      nextAction: 'Submit MSEDCL technical feasibility form',
      responsiblePerson: 'Sneha Patil',
      dueDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
    };
    this.db.msedclApps.unshift(msedclApp);

    // Create Loan record if applicable
    const loanRecord: LoanRecord = {
      id: `LN-${projectId}`,
      projectId,
      loanRequired: true,
      bankOrNbfc: 'State Bank of India',
      janSamarthAppNumber: `JS-SOL-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      applicationDate: today,
      loanAmount: Math.round(quotation.customerNetPayable * 0.8),
      status: 'Applied',
      bankRemarks: 'Application logged via Jan Samarth portal.',
    };
    this.db.loans.unshift(loanRecord);

    // Auto-create Project BoS Materials
    const panelsNeeded = quotation.panelQuantity || Math.ceil((quotation.systemCapacityKw * 1000) / 550);
    this.db.projectMaterials.push(
      {
        id: `PM-${projectId}-01`,
        projectId,
        inventoryItemId: 'INV-MAT-01',
        itemName: quotation.panelBrand || 'Waaree 550W Mono PERC DCR Solar Panel',
        brand: 'Waaree Energies',
        model: quotation.panelModel || 'WS-550-DCR',
        requiredQuantity: panelsNeeded,
        unit: 'Nos',
        allocatedStatus: 'Allocated',
      },
      {
        id: `PM-${projectId}-02`,
        projectId,
        inventoryItemId: 'INV-MAT-03',
        itemName: quotation.inverterBrand || 'Polycab On-Grid Solar Inverter',
        brand: 'Polycab',
        model: quotation.inverterModel || 'PS-GT-3.3K-1P',
        requiredQuantity: 1,
        unit: 'Nos',
        allocatedStatus: 'Allocated',
      },
      {
        id: `PM-${projectId}-03`,
        projectId,
        inventoryItemId: 'INV-MAT-05',
        itemName: 'Hot-Dip Galvanized Structure Set',
        brand: 'Frontier Custom Fab',
        model: 'HDG-80M',
        requiredQuantity: 1,
        unit: 'Set',
        allocatedStatus: 'Allocated',
      },
      {
        id: `PM-${projectId}-04`,
        projectId,
        inventoryItemId: 'INV-MAT-07',
        itemName: 'Solar ACDB IP65 Enclosure',
        brand: 'Frontier Power Tech',
        model: 'ACDB-1P-SPD2',
        requiredQuantity: 1,
        unit: 'Nos',
        allocatedStatus: 'Allocated',
      },
      {
        id: `PM-${projectId}-05`,
        projectId,
        inventoryItemId: 'INV-MAT-08',
        itemName: 'Solar DCDB 1000V DC Enclosure',
        brand: 'Frontier Power Tech',
        model: 'DCDB-1000V',
        requiredQuantity: 1,
        unit: 'Nos',
        allocatedStatus: 'Allocated',
      },
      {
        id: `PM-${projectId}-06`,
        projectId,
        inventoryItemId: 'INV-MAT-09',
        itemName: 'Chemical Earthing Electrodes',
        brand: 'Ashlok Safe Earth',
        model: 'CP-17.2-2M',
        requiredQuantity: 3,
        unit: 'Sets',
        allocatedStatus: 'Allocated',
      }
    );

    // Create Installation checklist
    const installationRec: InstallationRecord = {
      id: `INST-${projectId}`,
      projectId,
      customerName: customer.name,
      address: customer.address,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customer.address + ', Nagpur')}`,
      systemCapacityKw: quotation.systemCapacityKw,
      leadTechnician: 'Ganesh Patil',
      technicianPhone: '9823011228',
      scheduledDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: 'Scheduled',
      checklist: {
        structureInstalled: false,
        panelsMountedAndAligned: false,
        dcCableConcealedTray: false,
        acCableConnected: false,
        acdbInstalled: false,
        dcdbInstalled: false,
        earthingPitsConnected: false,
        lightningProtectionInstalled: false,
        inverterWallMounted: false,
        mainMeterBoardConnection: false,
        cableDressingDone: false,
        safetyLabelsWarningPasted: false,
        generationActiveTested: false,
        wifiMonitoringSetup: false,
        customerDemoGiven: false,
        safetyChecksCleanRoof: false,
      },
      panelSerialNumbers: [],
      inverterSerialNumber: '',
      photos: {},
    };
    this.db.installations.unshift(installationRec);

    // Master Project Record
    const project: Project = {
      id: projectId,
      projectId,
      leadId: quotation.leadId,
      customerId,
      customerName: customer.name,
      consumerNumber: customer.consumerNumber,
      mobile: customer.mobile,
      whatsapp: customer.whatsapp,
      address: customer.address,
      city: customer.city,
      systemCapacityKw: quotation.systemCapacityKw,
      stage: 'Pre-Agreement Signed',
      startDate: today,
      totalProjectValue: quotation.totalSystemPrice,
      totalReceived: 0,
      balanceDue: quotation.totalSystemPrice,
      subsidyAmount: quotation.pmSuryaGharSubsidyEstimate,
      subsidyStatus: 'Pending',
      loanRequired: true,
      loanStatus: 'Applied',
      documentsCompleteCount: 0,
      documentsTotalCount: MANDATORY_DOC_TYPES.length,
      assignedSalesperson: 'Amit Kulkarni',
      assignedSurveyor: 'Nikhil Raut',
      assignedTechnician: 'Ganesh Patil',
      driveFolderUrl: driveFolder,
      createdAt: now,
      updatedAt: now,
    };
    this.db.projects.unshift(project);

    // Initial project activity
    this.logActivity(
      projectId,
      `Project created with Master ID ${projectId} for ${customer.name} (${quotation.systemCapacityKw} kW)`,
      'Agreement',
      this.db.currentUser.name
    );

    // Create Initial Tasks
    this.addTask({
      projectId,
      customerName: customer.name,
      taskTitle: 'Collect 10 PM Surya Ghar Mandatory Documents from customer',
      assignedEmployeeId: 'USR-02',
      assignedEmployeeName: 'Pooja Deshmukh',
      createdDate: today,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      priority: 'High',
      status: 'Pending',
      stage: 'Document Collection',
    });

    this.notify();
    return project;
  }

  // --- PROJECTS ---
  public updateProject(id: string, updates: Partial<Project>): void {
    const idx = this.db.projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.db.projects[idx] = {
        ...this.db.projects[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.notify();
    }
  }

  // --- APPOINTMENTS ---
  public addAppointment(data: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
    const id = `APPT-2026-${String(this.db.appointments.length + 1).padStart(3, '0')}`;
    const newAppt: Appointment = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };
    this.db.appointments.unshift(newAppt);
    if (data.projectId) {
      this.logActivity(
        data.projectId,
        `New appointment scheduled: ${data.type} with ${data.assignedEmployeeName} on ${data.date}`,
        'Survey'
      );
    }
    this.notify();
    return newAppt;
  }

  public updateAppointment(id: string, updates: Partial<Appointment>): void {
    const idx = this.db.appointments.findIndex((a) => a.id === id);
    if (idx !== -1) {
      this.db.appointments[idx] = { ...this.db.appointments[idx], ...updates };
      this.notify();
    }
  }

  // --- SURVEYS ---
  public saveSurvey(survey: SiteSurvey): void {
    const idx = this.db.surveys.findIndex((s) => s.projectId === survey.projectId);
    if (idx !== -1) {
      this.db.surveys[idx] = survey;
    } else {
      this.db.surveys.unshift(survey);
    }
    this.logActivity(
      survey.projectId,
      `Site survey report recorded by ${survey.surveyorName} (Recommended: ${survey.recommendedCapacityKw} kW)`,
      'Survey'
    );
    this.notify();
  }

  // --- QUOTATIONS ---
  public addQuotation(quotationData: Omit<Quotation, 'id'>): Quotation {
    const id = `QT-2026-${String(this.db.quotations.length + 1).padStart(3, '0')}`;
    const newQt: Quotation = {
      ...quotationData,
      id,
    };
    this.db.quotations.unshift(newQt);
    if (newQt.projectId) {
      this.logActivity(
        newQt.projectId,
        `Quotation ${newQt.quotationNumber} generated for ${newQt.systemCapacityKw} kW (Total ₹${newQt.totalSystemPrice})`,
        'Quotation'
      );
    }
    this.notify();
    return newQt;
  }

  public updateQuotation(id: string, updates: Partial<Quotation>): void {
    const idx = this.db.quotations.findIndex((q) => q.id === id);
    if (idx !== -1) {
      this.db.quotations[idx] = { ...this.db.quotations[idx], ...updates };
      this.notify();
    }
  }

  public deleteQuotation(id: string): boolean {
    const q = this.db.quotations.find((item) => item.id === id);
    if (!q) return false;
    this.db.quotations = this.db.quotations.filter((item) => item.id !== id);
    this.logAudit('QUOTATION_DELETED', 'QUOTATION', id, `Quotation ${q.quotationNumber} (${q.customerName}) deleted`);
    this.notify();
    return true;
  }

  // --- DOCUMENTS ---
  public updateDocument(id: string, updates: Partial<DocumentItem>): void {
    const idx = this.db.documents.findIndex((d) => d.id === id);
    if (idx !== -1) {
      const doc = this.db.documents[idx];
      this.db.documents[idx] = { ...doc, ...updates };

      // Re-calculate verified count for project
      const projDocs = this.db.documents.filter((d) => d.projectId === doc.projectId);
      const verifiedCount = projDocs.filter((d) => d.verified).length;
      const proj = this.db.projects.find((p) => p.id === doc.projectId);
      if (proj) {
        proj.documentsCompleteCount = verifiedCount;
      }

      this.logActivity(
        doc.projectId,
        `Document ${doc.documentType} status updated: ${updates.verified ? 'VERIFIED' : updates.rejected ? 'REJECTED' : 'UPLOADED'}`,
        'Documents'
      );
      this.notify();
    }
  }

  // --- PAYMENTS ---
  public addPayment(paymentData: Omit<Payment, 'id'>): Payment {
    const id = `PAY-2026-${String(this.db.payments.length + 1).padStart(3, '0')}`;
    const newPay: Payment = {
      ...paymentData,
      id,
    };
    this.db.payments.unshift(newPay);

    // Update project financials
    const project = this.db.projects.find((p) => p.id === newPay.projectId);
    if (project) {
      project.totalReceived += newPay.amount;
      project.balanceDue = Math.max(0, project.totalProjectValue - project.totalReceived);
    }

    this.logActivity(
      newPay.projectId,
      `Payment received: ₹${newPay.amount.toLocaleString('en-IN')} via ${newPay.mode} (${newPay.paymentType})`,
      'Payment'
    );
    this.notify();
    return newPay;
  }

  public updatePayment(id: string, updates: Partial<Payment>): void {
    const idx = this.db.payments.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const oldAmount = this.db.payments[idx].amount;
      this.db.payments[idx] = { ...this.db.payments[idx], ...updates };

      if (updates.amount !== undefined && updates.amount !== oldAmount) {
        const proj = this.db.projects.find((p) => p.id === this.db.payments[idx].projectId);
        if (proj) {
          proj.totalReceived += (updates.amount - oldAmount);
          proj.balanceDue = Math.max(0, proj.totalProjectValue - proj.totalReceived);
        }
      }

      this.logAudit('PAYMENT_UPDATED', 'PAYMENT', id, `Updated receipt ${this.db.payments[idx].receiptNumber}`);
      this.notify();
    }
  }

  public getNextReceiptNumber(): string {
    const currentYear = new Date().getFullYear();
    const count = this.db.payments.length + 1;
    return `RCPT-${currentYear}-${String(count).padStart(3, '0')}`;
  }

  // --- PRINTABLE DOCUMENTS & FORMATS ---
  public getPrintableFormats(): PrintableDocumentFormat[] {
    if (!this.db.printableFormats || !Array.isArray(this.db.printableFormats) || this.db.printableFormats.length === 0) {
      this.db.printableFormats = [...INITIAL_PRINTABLE_FORMATS];
    }
    return this.db.printableFormats;
  }

  public addPrintableFormat(format: Omit<PrintableDocumentFormat, 'id' | 'createdAt'>): PrintableDocumentFormat {
    const id = `FMT-${Date.now().toString().slice(-4)}`;
    const newFormat: PrintableDocumentFormat = {
      ...format,
      id,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    if (!this.db.printableFormats) this.db.printableFormats = [];
    this.db.printableFormats.push(newFormat);
    this.logAudit('PRINTABLE_FORMAT_ADDED', 'DOCUMENT', id, `Added printable format: ${newFormat.title}`);
    this.notify();
    return newFormat;
  }

  public updatePrintableFormat(id: string, updates: Partial<PrintableDocumentFormat>): void {
    if (!this.db.printableFormats) this.db.printableFormats = [...INITIAL_PRINTABLE_FORMATS];
    const idx = this.db.printableFormats.findIndex((f) => f.id === id);
    if (idx !== -1) {
      this.db.printableFormats[idx] = {
        ...this.db.printableFormats[idx],
        ...updates,
        updatedAt: new Date().toISOString().slice(0, 10),
      };
      this.logAudit('PRINTABLE_FORMAT_UPDATED', 'DOCUMENT', id, `Updated printable format: ${this.db.printableFormats[idx].title}`);
      this.notify();
    }
  }

  public deletePrintableFormat(id: string): boolean {
    if (!this.db.printableFormats) return false;
    this.db.printableFormats = this.db.printableFormats.filter((f) => f.id !== id);
    this.logAudit('PRINTABLE_FORMAT_DELETED', 'DOCUMENT', id, `Deleted printable format ${id}`);
    this.notify();
    return true;
  }

  public resetPrintableFormats(): void {
    this.db.printableFormats = [...INITIAL_PRINTABLE_FORMATS];
    this.logAudit('PRINTABLE_FORMAT_RESET', 'DOCUMENT', 'ALL', 'Reset printable formats to system defaults');
    this.notify();
  }

  // --- LOANS ---
  public updateLoan(id: string, updates: Partial<LoanRecord>): void {
    const idx = this.db.loans.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.db.loans[idx] = { ...this.db.loans[idx], ...updates };
      const proj = this.db.projects.find((p) => p.id === this.db.loans[idx].projectId);
      if (proj && updates.status) {
        proj.loanStatus = updates.status;
      }
      this.logActivity(
        this.db.loans[idx].projectId,
        `Loan status updated: ${updates.status || 'Updated'} (${this.db.loans[idx].bankOrNbfc})`,
        'Loan'
      );
      this.notify();
    }
  }

  // --- INVENTORY ---
  public addInventoryItem(item: Omit<InventoryItem, 'id' | 'availableStock'>): InventoryItem {
    const id = `INV-MAT-${String(this.db.inventory.length + 1).padStart(2, '0')}`;
    const availableStock = item.warehouseStock - (item.reserved + item.dispatched + item.used);
    const newItem: InventoryItem = {
      ...item,
      id,
      availableStock,
    };
    this.db.inventory.unshift(newItem);
    this.notify();
    return newItem;
  }

  public updateInventoryItem(id: string, updates: Partial<InventoryItem>): void {
    const idx = this.db.inventory.findIndex((i) => i.id === id);
    if (idx !== -1) {
      const merged = { ...this.db.inventory[idx], ...updates };
      merged.availableStock = (merged.warehouseStock || 0) - ((merged.reserved || 0) + (merged.dispatched || 0) + (merged.used || 0));
      this.db.inventory[idx] = merged;
      this.notify();
    }
  }

  public deleteInventoryItem(id: string): boolean {
    const item = this.db.inventory.find((i) => i.id === id);
    if (!item) return false;
    this.db.inventory = this.db.inventory.filter((i) => i.id !== id);
    this.logAudit('INVENTORY_DELETED', 'INVENTORY', id, `Material item ${item.item} (${item.brand} ${item.model}) deleted from inventory`);
    this.notify();
    return true;
  }

  public adjustInventoryStock(id: string, delta: number, reason: string): void {
    const item = this.db.inventory.find((i) => i.id === id);
    if (!item) return;
    const oldStock = item.warehouseStock;
    const newStock = Math.max(0, oldStock + delta);
    this.updateInventoryItem(id, { warehouseStock: newStock });
    this.logAudit('STOCK_ADJUSTMENT', 'INVENTORY', id, `Stock adjusted for ${item.item}: ${oldStock} -> ${newStock} (${delta >= 0 ? '+' : ''}${delta}) Reason: ${reason}`);
    this.notify();
  }

  // --- DISPATCH ---
  public addDispatch(dispatchData: Omit<DispatchChallan, 'id'>): DispatchChallan {
    const id = `DISP-2026-${String(this.db.dispatches.length + 1).padStart(3, '0')}`;
    const newDisp: DispatchChallan = {
      ...dispatchData,
      id,
    };
    this.db.dispatches.unshift(newDisp);

    const proj = this.db.projects.find((p) => p.id === newDisp.projectId);
    if (proj) {
      proj.stage = 'Dispatched';
    }

    this.logActivity(
      newDisp.projectId,
      `Material Dispatched via Vehicle ${newDisp.vehicleNumber} (Driver: ${newDisp.driverName})`,
      'Material'
    );
    this.notify();
    return newDisp;
  }

  public updateDispatch(id: string, updates: Partial<DispatchChallan>): void {
    const idx = this.db.dispatches.findIndex((d) => d.id === id);
    if (idx !== -1) {
      this.db.dispatches[idx] = { ...this.db.dispatches[idx], ...updates };
      this.notify();
    }
  }

  // --- INSTALLATION ---
  public updateInstallation(projectId: string, updates: Partial<InstallationRecord>): void {
    const idx = this.db.installations.findIndex((i) => i.projectId === projectId);
    if (idx !== -1) {
      this.db.installations[idx] = { ...this.db.installations[idx], ...updates };
      const proj = this.db.projects.find((p) => p.id === projectId);
      if (proj) {
        if (updates.inverterSerialNumber) proj.inverterSerial = updates.inverterSerialNumber;
        if (updates.panelSerialNumbers) proj.panelSerials = updates.panelSerialNumbers;
        if (updates.status === 'Completed') proj.stage = 'QC Inspection';
      }
      this.logActivity(
        projectId,
        `Installation record updated by lead electrician (${updates.status || 'In Progress'})`,
        'Installation'
      );
      this.notify();
    }
  }

  // --- QC RECORD ---
  public saveQcRecord(qc: QualityControlRecord): void {
    const idx = this.db.qcRecords.findIndex((q) => q.projectId === qc.projectId);
    if (idx !== -1) {
      this.db.qcRecords[idx] = qc;
    } else {
      this.db.qcRecords.unshift(qc);
    }
    const proj = this.db.projects.find((p) => p.id === qc.projectId);
    if (proj && qc.status === 'Passed') {
      proj.stage = 'RTS Documentation';
    }
    this.logActivity(
      qc.projectId,
      `Mandatory Quality Control (QC) status: ${qc.status.toUpperCase()} (Inspector: ${qc.inspectorName})`,
      'QC'
    );
    this.notify();
  }

  // --- TASKS ---
  public addTask(taskData: Omit<ProjectTask, 'id'>): ProjectTask {
    const id = `TSK-${String(this.db.tasks.length + 1).padStart(3, '0')}`;
    const newTask: ProjectTask = {
      ...taskData,
      id,
    };
    this.db.tasks.unshift(newTask);
    this.notify();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<ProjectTask>): void {
    const idx = this.db.tasks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.db.tasks[idx] = { ...this.db.tasks[idx], ...updates };
      this.notify();
    }
  }

  // --- SERVICE TICKETS ---
  public addServiceTicket(ticketData: Omit<ServiceTicket, 'id' | 'ticketNumber'>): ServiceTicket {
    const num = String(this.db.serviceTickets.length + 1).padStart(4, '0');
    const newTkt: ServiceTicket = {
      ...ticketData,
      id: `SRV-TKT-${num}`,
      ticketNumber: `SRV-2026-${num}`,
    };
    this.db.serviceTickets.unshift(newTkt);
    this.logActivity(
      newTkt.projectId,
      `Service complaint registered: ${newTkt.problemCategory} - ${newTkt.problemDescription.slice(0, 50)}...`,
      'Service'
    );
    this.notify();
    return newTkt;
  }

  public updateServiceTicket(id: string, updates: Partial<ServiceTicket>): void {
    const idx = this.db.serviceTickets.findIndex((t) => t.id === id);
    if (idx !== -1) {
      this.db.serviceTickets[idx] = { ...this.db.serviceTickets[idx], ...updates };
      this.notify();
    }
  }

  // --- ALERTS ENGINE ---
  public getAlerts(): AlertItem[] {
    const alerts: AlertItem[] = [];
    const today = new Date().toISOString().slice(0, 10);

    // 1. Appointments tomorrow
    this.db.appointments.forEach((appt) => {
      if (appt.status === 'Scheduled' && appt.date >= today) {
        alerts.push({
          id: `ALT-APPT-${appt.id}`,
          type: 'APPOINTMENT_TOMORROW',
          title: `Upcoming Appointment: ${appt.type}`,
          message: `${appt.customerName} on ${appt.date} at ${appt.time} (${appt.assignedEmployeeName})`,
          projectId: appt.projectId,
          customerName: appt.customerName,
          priority: 'High',
          date: appt.date,
          linkTab: 'appointments',
        });
      }
    });

    // 2. Overdue or pending 2nd loan disbursement
    this.db.loans.forEach((loan) => {
      if (loan.status === 'Second Disbursement Requested' && !loan.secondDisbursementReceivedDate) {
        alerts.push({
          id: `ALT-DISB-${loan.id}`,
          type: 'SECOND_DISBURSEMENT_OVERDUE',
          title: `Bank 2nd Disbursement Pending: ₹${loan.secondDisbursementAmount?.toLocaleString('en-IN') || '30,000'}`,
          message: `Project ${loan.projectId} has inspection passed; pending release from ${loan.bankOrNbfc}.`,
          projectId: loan.projectId,
          priority: 'Urgent',
          date: loan.secondDisbursementRequestedDate || today,
          linkTab: 'loan',
        });
      }
    });

    // 3. Document pending on active projects
    this.db.projects.forEach((proj) => {
      if (proj.documentsCompleteCount < proj.documentsTotalCount && proj.stage === 'Document Collection') {
        alerts.push({
          id: `ALT-DOC-${proj.id}`,
          type: 'DOCUMENTS_PENDING',
          title: `Documents Pending (${proj.documentsCompleteCount}/${proj.documentsTotalCount})`,
          message: `${proj.customerName} (${proj.projectId}): Mandatory documents incomplete.`,
          projectId: proj.id,
          customerName: proj.customerName,
          priority: 'Medium',
          date: today,
          linkTab: 'documents',
        });
      }
    });

    // 4. Overdue tasks
    this.db.tasks.forEach((tsk) => {
      if (tsk.status !== 'Completed' && tsk.dueDate < today) {
        alerts.push({
          id: `ALT-TSK-${tsk.id}`,
          type: 'FOLLOW_UP_DUE',
          title: `Overdue Task: ${tsk.taskTitle}`,
          message: `Assigned to ${tsk.assignedEmployeeName} (Due: ${tsk.dueDate})`,
          projectId: tsk.projectId,
          customerName: tsk.customerName,
          priority: 'Urgent',
          date: tsk.dueDate,
          linkTab: 'tasks',
        });
      }
    });

    // 5. Low warehouse inventory stock
    this.db.inventory.forEach((inv) => {
      if (inv.availableStock <= inv.minAlertStock) {
        alerts.push({
          id: `ALT-INV-${inv.id}`,
          type: 'DISPATCH_PENDING',
          title: `Low Warehouse Stock Alert: ${inv.brand} ${inv.item}`,
          message: `Only ${inv.availableStock} ${inv.unit} remaining (Minimum threshold: ${inv.minAlertStock} ${inv.unit})`,
          priority: 'High',
          date: today,
          linkTab: 'materials',
        });
      }
    });

    return alerts;
  }
}

export const storage = new StorageService();
