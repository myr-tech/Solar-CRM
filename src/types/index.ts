export type UserRole =
  | 'ADMIN'
  | 'OFFICE_STAFF'
  | 'SALES'
  | 'SURVEYOR'
  | 'STORE_DISPATCH'
  | 'INSTALLATION_TEAM'
  | 'DOCUMENTATION_TEAM'
  | 'ACCOUNTS'
  | 'SERVICE_TEAM';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string;
  active: boolean;
  avatar?: string;
  password?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
}

export type LeadSource =
  | 'Customer Reference'
  | 'WhatsApp Marketing'
  | 'Existing Customer'
  | 'Facebook'
  | 'Instagram'
  | 'Google'
  | 'Website'
  | 'Walk-in'
  | 'Dealer/Partner'
  | 'Other';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Appointment Fixed'
  | 'Survey Done'
  | 'Quotation Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost'
  | 'On Hold';

export interface Lead {
  id: string; // e.g. "LEAD-2026-012"
  date: string;
  customerName: string;
  mobile: string;
  whatsapp: string;
  email: string;
  consumerNumber: string; // Electricity consumer number
  address: string;
  city: string; // Default Nagpur
  pincode: string;
  interestedCapacityKw: number;
  leadSource: LeadSource;
  referredBy?: string;
  salesperson: string;
  status: LeadStatus;
  nextFollowUpDate: string;
  remarks: string;
  projectId?: string; // Set when converted to project
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType =
  | 'Site Survey'
  | 'Customer Meeting'
  | 'Document Collection'
  | 'Installation'
  | 'Inspection'
  | 'Service Visit'
  | 'Payment Collection';

export type AppointmentStatus =
  | 'Scheduled'
  | 'Completed'
  | 'Rescheduled'
  | 'Cancelled';

export interface Appointment {
  id: string; // e.g. "APPT-2026-0042"
  projectId?: string;
  leadId?: string;
  customerName: string;
  mobile: string;
  address: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  date: string;
  time: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  type: AppointmentType;
  status: AppointmentStatus;
  remarks: string;
  createdAt: string;
}

export interface SiteSurvey {
  id: string;
  projectId: string; // FCSS-2026-0001
  surveyDate: string;
  surveyorName: string;
  surveyorPhone: string;
  // Customer info
  customerName: string;
  consumerNumber: string;
  mobile: string;
  address: string;
  msedclSdn: string; // Sub Division Name/No
  sanctionedLoadKw: number;
  existingPhase: 'Single Phase' | 'Three Phase';
  existingSupplyVoltage: string;

  // Rooftop
  roofType: 'RCC Flat' | 'Tin Shed' | 'Tile Roof' | 'Elevated Structure Required';
  roofAreaSqFt: number;
  availableInstallationAreaSqFt: number;
  shadowFreeAreaSqFt: number;
  roofDirection: 'South' | 'South-East' | 'South-West' | 'East' | 'West' | 'North';
  structurePlacement: 'Flush Mount' | 'Elevated GI' | 'High-Rise Super Structure';
  accessCondition: 'Internal Stairs' | 'External Ladder' | 'Difficult Access';
  waterproofingConcern: boolean;
  buildingHeightMeters: number;

  // Shadow analysis
  morningShadow: 'None' | 'Slight' | 'Severe';
  afternoonShadow: 'None' | 'Slight' | 'Severe';
  eveningShadow: 'None' | 'Slight' | 'Severe';
  nearbyBuildingObstruction: string;
  treesObstruction: string;
  waterTankObstruction: string;
  otherObstruction: string;

  // Inverter Location
  proposedInverterLocation: string;
  inverterMountType: 'Wall' | 'Ground' | 'Shed';
  ventilationCondition: 'Well Ventilated' | 'Moderate' | 'Enclosed';
  distanceFromPanelsMeters: number;
  distanceFromMainDbMeters: number;
  weatherProtection: 'Covered / Indoor' | 'Semi-Outdoor with Canopy' | 'Exposed';

  // Wiring route
  dcCableRoute: string;
  acCableRoute: string;
  approxDcCableLengthMeters: number;
  approxAcCableLengthMeters: number;
  cableTrayRequirement: 'Required' | 'Not Required' | 'Partial';
  wiringType: 'Concealed' | 'Open Casing' | 'Armoured Cable';

  // Earthing
  existingEarthPits: number;
  newPitsRequired: number; // usually 3 for solar (Inverter AC, DC, Lightning)
  proposedEarthPitLocation: string;
  distanceToEarthPitMeters: number;
  lightningProtectionRequirement: boolean;

  // Electrical
  meterLocation: string;
  mainDbLocation: string;
  acdbRequirement: boolean;
  dcdbRequirement: boolean;
  existingEarthingCondition: 'Good' | 'Weak' | 'None';
  mainCableSize: string;

  // Geo Tag
  latitude: number;
  longitude: number;
  geoAddress: string;

  // Photos (base64 or URLs)
  photos: {
    buildingFront?: string;
    rooftopView?: string;
    shadowObstruction?: string;
    panelProposedArea?: string;
    inverterLocation?: string;
    cableRoute?: string;
    meterBoard?: string;
    mainDb?: string;
    earthingArea?: string;
  };
  recommendedCapacityKw: number;
  surveyReportPdfGenerated?: boolean;
  remarks: string;
  status: 'Draft' | 'Completed';
}

export type QuotationStatus =
  | 'Draft'
  | 'Sent'
  | 'Negotiation'
  | 'Approved'
  | 'Rejected'
  | 'Expired';

export interface Quotation {
  id: string; // e.g. "QT-2026-0105"
  quotationNumber: string;
  projectId?: string;
  leadId?: string;
  date: string;
  customerName: string;
  consumerNumber: string;
  mobile: string;
  address: string;
  systemCapacityKw: number;

  // Technical Specs
  panelBrand: string;
  panelModel: string;
  panelWattage: number; // e.g. 550W
  panelQuantity: number;
  inverterBrand: string;
  inverterModel: string;
  inverterCapacityKw: number;
  structureType: string;
  acdbSpecs: string;
  dcdbSpecs: string;
  dcCableSpecs: string;
  acCableSpecs: string;
  earthingSpecs: string;
  lightningProtectionSpecs: string;
  installationScope: string;
  transportationIncluded: boolean;

  // Financials
  systemBasePrice: number;
  discount: number;
  gstRatePercent: number; // 13.8% composite solar rate or 18%
  gstAmount: number;
  totalSystemPrice: number;
  pmSuryaGharSubsidyEstimate: number; // e.g. 78000 for 3kW
  customerNetPayable: number;
  suggestedAdvanceAmount: number;
  balancePayable: number;

  status: QuotationStatus;
  validUntil: string;
  remarks: string;

  // Editable Payment Terms, Project Completion Timeline, Payment Schedule, Scope Of Project
  paymentTerms?: string;
  paymentSchedule?: PaymentMilestone[];
  projectCompletionTimeline?: string;
  timelineMilestones?: TimelinePhase[];
  scopeOfProject?: string[];
  warrantyTerms?: string;

  // Company Profile / Letterhead
  companyProfileId?: string;

  // Whole System Price (alias / editable turnkey total)
  wholeSystemPrice?: number;

  // Material & Inventory items list (Editable, add/remove items)
  materialItems?: QuotationMaterialItem[];

  // Document Required for Load Expansion & Net Metering checklist
  loadExpansionDocuments?: LoadExpansionDocumentItem[];
}

export interface CompanyProfile {
  id: string; // e.g. "COMP-001"
  name: string; // e.g. "Frontier Complete Solar Solutions"
  tagline?: string; // e.g. "Registered PM Surya Ghar Rooftop Solar Vendor"
  logoUrl?: string; // Data URL or Image URL
  address: string; // e.g. "Plot 102, MIDC Hingna Road, Nagpur, Maharashtra - 440028"
  email: string; // e.g. "contact@frontiersolar.in"
  ownerContact: string; // e.g. "+91 98230 11223"
  ownerName?: string; // e.g. "Er. Rajesh Sharma"
  gstNumber: string; // e.g. "27AAACF1234M1Z5"
  registrationNumber?: string; // e.g. "MSEDCL/PV/VENDOR/2026/NGP-09"
  panNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfsc?: string;
  upiId?: string;
  isDefault?: boolean;
}

export interface PrintableDocumentFormat {
  id: string;
  title: string;
  category: 'Discom MSEDCL' | 'PM Surya Ghar' | 'Banking & Jan Samarth' | 'Society & Legal' | 'Custom';
  description: string;
  templateType: 'meter_name_change' | 'consumer_undertaking' | 'form_u' | 'cancel_pv' | 'meter_testing' | 'cancel_loan' | 'apartment_noc' | 'custom';
  defaultTitle: string;
  contentTemplate: string;
  requiredFields: string[];
  pdfFileUrl?: string;
  pdfFileName?: string;
  pdfFileSize?: string;
  createdAt: string;
  updatedAt?: string;
}

export type ReceiptTemplateId =
  | 'corporate_letterhead'
  | 'msedcl_standard'
  | 'gold_solar_voucher'
  | 'compact_slip'
  | 'milestone_agreement';

export interface QuotationMaterialItem {
  id: string;
  item: string;
  category: string;
  specs: string;
  quantity: number;
  unit: string;
  rate?: number;
  includedInTurnkey: boolean;
}

export interface LoadExpansionDocumentItem {
  id: string;
  documentName: string;
  required: boolean;
  notes?: string;
}

export interface PaymentMilestone {
  id?: string;
  milestone: string;
  percentage: number;
  amount: number;
  dueCondition: string;
}

export interface TimelinePhase {
  id?: string;
  phase: string;
  durationDays: number;
  description: string;
}

export interface PreAgreement {
  id: string;
  projectId: string;
  agreementNumber: string;
  customerName: string;
  capacityKw: number;
  totalAmount: number;
  termsAccepted: boolean;
  generatedDate: string;
  sentDate?: string;
  signedDate?: string;
  status: 'Draft' | 'Sent' | 'Signed' | 'Verified';
  uploadedDocumentUrl?: string;
}

export type DocumentType =
  | 'Aadhaar Card'
  | 'PAN Card'
  | 'Electricity Bill'
  | 'Bank Passbook / Cancelled Cheque'
  | 'Bank-linked Mobile Number Verification'
  | 'Email ID Verification'
  | 'House Tax Document / Property Proof'
  | 'Installation Location Photograph'
  | 'Geo-tagged Rooftop Photograph'
  | 'Signed Pre-agreement'
  | 'Passport Size Photo'
  | 'MSEDCL NOC / Consent Letter';

export interface DocumentItem {
  id: string;
  projectId: string;
  documentType: DocumentType;
  required: boolean;
  uploaded: boolean;
  verified: boolean;
  rejected: boolean;
  reUploadRequired: boolean;
  verificationRemarks?: string;
  uploadDate?: string;
  uploadedBy?: string;
  fileUrl?: string;
  fileName?: string;
}

export type NationalPortalStatus =
  | 'Not Started'
  | 'Draft'
  | 'Application Submitted'
  | 'Documents Uploaded'
  | 'Registration Completed'
  | 'Correction Required'
  | 'Reverted'
  | 'Approved';

export interface NationalPortalApp {
  id: string;
  projectId: string;
  applicationId: string; // e.g. "PM-SG-2026-MH-44001"
  registrationDate: string;
  consumerNumber: string;
  status: NationalPortalStatus;
  documentsUploaded: boolean;
  correctionRemarks?: string;
  responsibleEmployee: string;
  dueDate: string;
  lastUpdated: string;
  remarks: string;
}

export type MsedclPvStatus =
  | 'Not Started'
  | 'Submitted'
  | 'Feasibility Pending'
  | 'Feasibility Approved'
  | 'Installation'
  | 'RTS Documentation'
  | 'Submitted'
  | 'Release Letter'
  | 'Net Meter'
  | 'Inspection'
  | 'Completion';

export interface MsedclPvApp {
  id: string;
  projectId: string;
  pvApplicationNumber: string; // e.g. "MSEDCL-PV-2026-98124"
  consumerNumber: string;
  sdn: string; // Sub division name / code (e.g. Besa Sub-Dn Nagpur)
  applicationDate: string;
  feasibilityStatus: 'Pending' | 'Approved' | 'Rejected';
  feasibilityDate?: string;
  status: MsedclPvStatus;
  remarks: string;
  nextAction: string;
  responsiblePerson: string;
  dueDate: string;
}

export type PaymentType =
  | 'Booking'
  | 'Advance'
  | 'Installation Payment'
  | 'Loan Disbursement 1'
  | 'Loan Disbursement 2'
  | 'Final Payment'
  | 'Subsidy Adjustment'
  | 'Other';

export type PaymentMode =
  | 'NEFT/RTGS'
  | 'UPI'
  | 'Cheque'
  | 'Bank Transfer'
  | 'Cash'
  | 'Loan Direct Credit';

export interface Payment {
  id: string; // e.g. "PAY-2026-0034"
  projectId: string;
  customerName: string;
  paymentType: PaymentType;
  amount: number;
  date: string;
  mode: PaymentMode;
  transactionNumber: string;
  bankName: string;
  receiptNumber: string;
  remarks: string;
  verified: boolean;
  companyProfileId?: string;
  quotationId?: string;
}

export type LoanStatus =
  | 'Not Required'
  | 'Not Applied'
  | 'Applied'
  | 'Under Review'
  | 'Sanctioned'
  | 'First Disbursement'
  | 'Installation'
  | 'Completion Submitted'
  | 'Second Disbursement Requested'
  | 'Fully Disbursed'
  | 'Rejected'
  | 'Cancelled';

export interface LoanRecord {
  id: string;
  projectId: string;
  loanRequired: boolean;
  bankOrNbfc: string; // e.g. "SBI", "Bank of Maharashtra", "Canara Bank", "Union Bank"
  janSamarthAppNumber: string;
  applicationDate: string;
  loanAmount: number;
  status: LoanStatus;
  sanctionDate?: string;
  firstDisbursementAmount?: number;
  firstDisbursementDate?: string;
  completionSubmittedDate?: string;
  secondDisbursementRequestedDate?: string;
  secondDisbursementAmount?: number;
  secondDisbursementReceivedDate?: string;
  bankRemarks?: string;
  overdueAlertDays?: number;
}

export type InventoryCategory =
  | 'Solar Panels'
  | 'Inverters'
  | 'Structure'
  | 'ACDB'
  | 'DCDB'
  | 'AC Cable'
  | 'DC Cable'
  | 'MC4 Connectors'
  | 'Earthing Material'
  | 'Lightning Protection'
  | 'Accessories & Hardware';

export interface InventoryItem {
  id: string;
  item: string;
  category: InventoryCategory;
  brand: string;
  model: string;
  specifications: string;
  unit: string; // Nos, Meters, Sets, Kgs
  serialNumber?: string;
  batchNumber?: string;
  purchaseDate: string;
  supplier: string;
  warehouseStock: number;
  reserved: number;
  dispatched: number;
  used: number;
  availableStock: number;
  minAlertStock: number;
  unitPrice: number;
}

export interface ProjectMaterialItem {
  id: string;
  projectId: string;
  inventoryItemId: string;
  itemName: string;
  brand: string;
  model: string;
  requiredQuantity: number;
  unit: string;
  allocatedStatus: 'Allocated' | 'Reserved' | 'Dispatched' | 'Installed';
  serialNumbers?: string[];
}

export type DispatchStatus =
  | 'Preparing'
  | 'Dispatched'
  | 'In Transit'
  | 'Delivered'
  | 'Shortage / Damage Reported';

export interface DispatchChallan {
  id: string;
  dispatchNumber: string; // "CHAL-2026-0045"
  projectId: string;
  customerName: string;
  address: string;
  googleMapsUrl: string;
  driverName: string;
  driverMobile: string;
  vehicleNumber: string;
  dispatchDate: string;
  deliveryDate?: string;
  status: DispatchStatus;
  materials: {
    item: string;
    quantity: number;
    unit: string;
  }[];
  deliveryPhotos?: string[];
  remarks: string;
  deliveryConfirmedBy?: string;
}

export interface InstallationRecord {
  id: string;
  projectId: string;
  customerName: string;
  address: string;
  googleMapsUrl: string;
  systemCapacityKw: number;
  leadTechnician: string;
  technicianPhone: string;
  scheduledDate: string;
  completionDate?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Pending QC';
  
  // 16-point installation checklist
  checklist: {
    structureInstalled: boolean;
    panelsMountedAndAligned: boolean;
    dcCableConcealedTray: boolean;
    acCableConnected: boolean;
    acdbInstalled: boolean;
    dcdbInstalled: boolean;
    earthingPitsConnected: boolean; // 3 earth pits
    lightningProtectionInstalled: boolean;
    inverterWallMounted: boolean;
    mainMeterBoardConnection: boolean;
    cableDressingDone: boolean;
    safetyLabelsWarningPasted: boolean;
    generationActiveTested: boolean;
    wifiMonitoringSetup: boolean;
    customerDemoGiven: boolean;
    safetyChecksCleanRoof: boolean;
  };

  // Captured Serial Numbers
  panelSerialNumbers: string[];
  inverterSerialNumber: string;
  acdbSerialNumber?: string;
  dcdbSerialNumber?: string;

  // Photographs
  photos: {
    structureFullView?: string;
    panelsInstalledAngle?: string;
    inverterMounted?: string;
    acdbDcdbBoard?: string;
    earthingPits?: string;
    cableDressing?: string;
    generationTestDisplay?: string;
    customerWithSystem?: string;
  };
  customerSignature?: string; // Data URL
  technicianNotes?: string;
}

export type QcStatus = 'Pending' | 'Passed' | 'Rework Required' | 'Approved';

export interface QualityControlRecord {
  id: string;
  projectId: string;
  inspectorName: string;
  inspectionDate: string;
  status: QcStatus;
  checks: {
    structureFastenersTightened: boolean;
    panelAlignmentAndTightening: boolean;
    dcPolarityVerified: boolean;
    mc4ConnectorsCrimpedWaterproof: boolean;
    cableDressingConduitTies: boolean;
    earthingResistanceWithinNorms: boolean; // < 5 ohms
    acConnectionBreakersRated: boolean;
    dcdbSpdWorking: boolean;
    acdbSpdWorking: boolean;
    inverterEarthingSeparate: boolean;
    generationVoltageWithinMsedclLimit: boolean;
    warningLabelsBilingualPasted: boolean;
    leakageCurrentTestPassed: boolean;
    roofCleanedPostInstallation: boolean;
    photosArchived: boolean;
  };
  reworkItems?: string;
  approvalRemarks?: string;
  approvedDate?: string;
}

export interface MsedclDocTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  ready: boolean;
  contentTemplate: string;
}

export type RtsStatus =
  | 'Pending'
  | 'Documents Uploaded'
  | 'Submitted'
  | 'Correction Required'
  | 'Reverted'
  | 'Resubmitted'
  | 'Approved';

export interface RtsSubmission {
  id: string;
  projectId: string;
  submissionDate: string;
  websiteRefNumber: string;
  status: RtsStatus;
  documentsUploaded: boolean;
  proofDocumentUrl?: string;
  responsibleEmployee: string;
  nextAction: string;
  dueDate: string;
  remarks: string;
}

export interface ReleaseLetterRecord {
  id: string;
  projectId: string;
  requestedDate: string;
  receivedDate?: string;
  status: 'Pending' | 'Received';
  referenceNumber?: string;
  netMeterPermissionGranted: boolean;
  customerInformed: boolean;
  msedclMessageSent: boolean;
  documentUrl?: string;
  remarks: string;
}

export interface NetMeterRecord {
  id: string;
  projectId: string;
  requestDate: string;
  installationDate?: string;
  meterNumber: string;
  initialExportReading: number;
  initialImportReading: number;
  meterPhotoUrl?: string;
  status: 'Requested' | 'Testing Scheduled' | 'Installed' | 'Active';
  remarks: string;
}

export interface DiscomInspectionRecord {
  id: string;
  projectId: string;
  requestDate: string;
  inspectionDate?: string;
  inspectorName?: string;
  inspectorDesignation?: string;
  status: 'Scheduled' | 'Passed' | 'Defects Found' | 'Re-inspected' | 'Certified';
  defectsNotes?: string;
  passedDate?: string;
  completionCertificateNumber?: string;
  portalUpdated: boolean;
}

export interface SubsidyRecord {
  id: string;
  projectId: string;
  eligibleCapacityKw: number;
  subsidyAmount: number; // ₹30k/60k/78k
  status: 'Eligible' | 'Inspection Passed' | 'Claim Submitted' | 'Processing' | 'Disbursed to Customer';
  submittedDate?: string;
  disbursedDate?: string;
  referenceNumber?: string;
  bankAccountNumber?: string;
  remarks: string;
}

export interface BankSecondDisbursementRecord {
  id: string;
  projectId: string;
  bankName: string;
  bankInformedDate: string;
  documentsSent: boolean;
  secondDisbursementRequested: boolean;
  amount: number;
  receivedDate?: string;
  isOverdue: boolean; // if > 7 days
  bankRemarks: string;
}

export type InvoiceStatus = 'Draft' | 'Generated' | 'Partially Paid' | 'Paid' | 'Cancelled';

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string; // "INV-2026-0089"
  projectId: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  address: string;
  consumerNumber: string;
  systemCapacityKw: number;
  panelDetails: string;
  inverterDetails: string;
  baseAmount: number;
  gstAmount: number;
  discount: number;
  totalInvoiceAmount: number;
  totalReceived: number;
  balanceDue: number;
  status: InvoiceStatus;
  terms: string;
}

export interface WarrantyRecord {
  id: string;
  projectId: string;
  customerName: string;
  consumerNumber: string;
  systemCapacityKw: number;
  panelBrand: string;
  panelWarrantyYears: number; // 25 years
  panelWarrantyEndDate: string;
  inverterBrand: string;
  inverterWarrantyYears: number; // 5 to 10 years
  inverterWarrantyEndDate: string;
  workmanshipWarrantyYears: number; // 5 years
  workmanshipWarrantyEndDate: string;
  amcActive: boolean;
  amcType?: string;
  amcExpiryDate?: string;
  warrantyCertificateUrl?: string;
  alert90Days: boolean;
  alert30Days: boolean;
}

export type TicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export interface ServiceTicket {
  id: string;
  ticketNumber: string; // "SRV-2026-0012"
  projectId: string;
  customerName: string;
  mobile: string;
  consumerNumber: string;
  inverterSerialNumber?: string;
  complaintDate: string;
  problemCategory: 'Inverter Fault' | 'Low Generation' | 'Tripping' | 'Physical Damage' | 'Wi-Fi Offline' | 'Net Meter Issue' | 'Routine AMC';
  problemDescription: string;
  assignedTechnician?: string;
  visitDate?: string;
  diagnosis?: string;
  partsUsed?: string;
  resolution?: string;
  priority: TicketPriority;
  status: TicketStatus;
  closingDate?: string;
  customerSignature?: string;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  timestamp: string; // ISO string
  displayDate: string;
  action: string;
  category: 'Lead' | 'Survey' | 'Quotation' | 'Agreement' | 'Documents' | 'Portal' | 'MSEDCL' | 'Payment' | 'Loan' | 'Material' | 'Installation' | 'QC' | 'RTS' | 'Net Meter' | 'Inspection' | 'Subsidy' | 'Service';
  performedBy: string;
  remarks?: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  customerName: string;
  taskTitle: string;
  assignedEmployeeId: string;
  assignedEmployeeName: string;
  createdDate: string;
  dueDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  stage: string;
  remarks?: string;
  isOverdue?: boolean;
}

export type ProjectStage =
  | 'Lead / Inquiry'
  | 'Appointment Fixed'
  | 'Site Survey Done'
  | 'Quotation Sent'
  | 'Pre-Agreement Signed'
  | 'Document Collection'
  | 'National Portal Registration'
  | 'MSEDCL PV Application'
  | 'Advance Payment'
  | 'Loan Processing'
  | 'Material Allocation'
  | 'Dispatched'
  | 'Installation'
  | 'QC Inspection'
  | 'RTS Documentation'
  | 'Release Letter'
  | 'Net Meter Installation'
  | 'Discom Inspection'
  | 'Subsidy Claim'
  | 'Bank 2nd Disbursement'
  | 'Final Payment'
  | 'Completed & Handover'
  | 'AMC & Warranty';

export interface Customer {
  id: string;
  projectId: string; // Master ID: FCSS-2026-XXXX
  name: string;
  mobile: string;
  whatsapp: string;
  email: string;
  consumerNumber: string; // Electricity Consumer No
  msedclSdn: string; // Sub-Division Name
  address: string;
  city: string; // Default Nagpur
  pincode: string;
  sanctionedLoadKw: number;
  tariffCategory: string; // e.g. LT-I Residential
  phase: 'Single Phase' | 'Three Phase';
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  createdAt: string;
}

export interface Project {
  id: string; // Master Primary ID: "FCSS-2026-0001"
  projectId: string; // Same as id
  leadId?: string;
  customerId: string;
  customerName: string;
  consumerNumber: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  systemCapacityKw: number;
  stage: ProjectStage;
  startDate: string;
  completionDate?: string;
  totalProjectValue: number;
  totalReceived: number;
  balanceDue: number;
  subsidyAmount: number;
  subsidyStatus: 'Pending' | 'Approved' | 'Disbursed';
  loanRequired: boolean;
  loanStatus: LoanStatus;
  documentsCompleteCount: number; // e.g. 8 out of 10
  documentsTotalCount: number; // 10
  assignedSalesperson: string;
  assignedSurveyor?: string;
  assignedTechnician?: string;
  inverterSerial?: string;
  panelSerials?: string[];
  netMeterNumber?: string;
  driveFolderUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AlertItem {
  id: string;
  type:
    | 'APPOINTMENT_TOMORROW'
    | 'FOLLOW_UP_DUE'
    | 'DOCUMENTS_PENDING'
    | 'QUOTATION_PENDING'
    | 'ADVANCE_PENDING'
    | 'LOAN_PENDING'
    | 'DISPATCH_PENDING'
    | 'INSTALLATION_PENDING'
    | 'RTS_SUBMISSION_PENDING'
    | 'RELEASE_LETTER_PENDING'
    | 'NET_METER_PENDING'
    | 'INSPECTION_PENDING'
    | 'SUBSIDY_PENDING'
    | 'SECOND_DISBURSEMENT_OVERDUE'
    | 'FINAL_PAYMENT_PENDING'
    | 'WARRANTY_EXPIRY_SOON'
    | 'SERVICE_DUE';
  title: string;
  message: string;
  projectId?: string;
  customerName?: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  date: string;
  linkTab?: string;
}
