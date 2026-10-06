import { 
  JudiciaryService, 
  PaymentAttempt, 
  ElectronicReceipt, 
  AuditLog, 
  SystemStats,
  StaffRecord,
  StaffRole
} from './types';
import { generateInternalTxnId, generatePaymentReference, generateGatewayRef } from './utils';

const initialServices: JudiciaryService[] = [
  {
    id: 'srv-001',
    code: 'KJ-CF-001',
    category: 'Court Fees',
    name: 'Court Filing Fee',
    description: 'Official filing fee for civil suit, motion, originating summons or appeal before High Court of Kaduna State.',
    courtType: 'High Court Kaduna',
    feeModel: 'FIXED',
    amount: 50000,
    unitLabel: 'Flat Fee',
    requiredFields: ['suit_number', 'applicant_name', 'respondent_name', 'division_station'],
    status: 'ACTIVE',
  },
  {
    id: 'srv-002',
    code: 'KJ-CS-002',
    category: 'Court Fees',
    name: 'Court Summons Fee',
    description: 'Issuance and service fee for court witness or defendant summons.',
    courtType: 'High Court Kaduna',
    feeModel: 'FIXED',
    amount: 15000,
    unitLabel: 'Per Summons',
    requiredFields: ['suit_number', 'applicant_name', 'respondent_name'],
    status: 'ACTIVE',
  },
  {
    id: 'srv-003',
    code: 'KJ-PR-003',
    category: 'Probate Registry',
    name: 'Probate Application & Letters of Administration',
    description: 'Processing fee for Grant of Probate or Letters of Administration without Will.',
    courtType: 'Probate Registry Kaduna',
    feeModel: 'FIXED',
    amount: 75000,
    unitLabel: 'Per Estate File',
    requiredFields: ['file_number', 'applicant_name', 'purpose_of_payment'],
    status: 'ACTIVE',
  },
  {
    id: 'srv-004',
    code: 'KJ-CC-004',
    category: 'Certifications & Copies',
    name: 'Certified True Copy (CTC) of Judgment / Order',
    description: 'Certification and copy charge for court records, proceedings, and judgments.',
    courtType: 'High Court Kaduna',
    feeModel: 'VARIABLE',
    amount: 2000,
    unitLabel: 'Per Page / Copy',
    requiredFields: ['case_number', 'applicant_name', 'purpose_of_payment'],
    status: 'ACTIVE',
  },
  {
    id: 'srv-005',
    code: 'KJ-SF-005',
    category: 'Court Fees',
    name: 'Court Search & File Inspection Fee',
    description: 'Official registry search fee to inspect record of proceedings or case files.',
    courtType: 'High Court Kaduna',
    feeModel: 'FIXED',
    amount: 10000,
    unitLabel: 'Per File Search',
    requiredFields: ['case_number', 'applicant_name', 'lawyer_chambers'],
    status: 'ACTIVE',
  },
  {
    id: 'srv-006',
    code: 'KJ-CO-006',
    category: 'Court Fees',
    name: 'Enrolment of Court Order',
    description: 'Enrolment and certification fee for enrolled court orders.',
    courtType: 'High Court Kaduna',
    feeModel: 'FIXED',
    amount: 25000,
    unitLabel: 'Flat Fee',
    requiredFields: ['suit_number', 'applicant_name', 'division_station'],
    status: 'ACTIVE',
  },
  {
    id: 'srv-007',
    code: 'KJ-AF-007',
    category: 'Affidavits & Filings',
    name: 'Swearing of Affidavit / Oaths Verification',
    description: 'Official swearing fee for statutory declaration or affidavit of facts.',
    courtType: 'Magistrate Court Kaduna',
    feeModel: 'VARIABLE',
    amount: 1500,
    unitLabel: 'Per Affidavit',
    requiredFields: ['applicant_name', 'purpose_of_payment'],
    status: 'ACTIVE',
  },
  {
    id: 'srv-008',
    code: 'KJ-SC-008',
    category: 'Sharia Court Fees',
    name: 'Sharia Court Appeal Filing Fee',
    description: 'Filing fee for appeals from Area Courts to Sharia Court of Appeal Kaduna State.',
    courtType: 'Sharia Court of Appeal',
    feeModel: 'FIXED',
    amount: 30000,
    unitLabel: 'Per Appeal File',
    requiredFields: ['case_number', 'applicant_name', 'respondent_name'],
    status: 'ACTIVE',
  },
];

const demoPaidAt = new Date().toISOString();
const demoPaymentRef = 'KJ202610068F4A72';
const demoReceiptNo = 'KJRC-2026-000001';

const initialPayments: PaymentAttempt[] = [
  {
    internalTxnId: 'TXN-20261006-88192',
    paymentReference: demoPaymentRef,
    gatewayRef: 'GW-PAY-992104',
    payerName: 'John Doe',
    payerEmail: 'johndoe@example.com',
    payerPhone: '+234 803 123 4567',
    serviceId: 'srv-001',
    serviceName: 'Court Filing Fee',
    category: 'Court Fees',
    courtDivision: 'High Court Kaduna',
    quantity: 1,
    unitPrice: 50000,
    totalAmount: 50000,
    fieldData: {
      suit_number: 'KDH/HC/2026/102',
      applicant_name: 'John Doe',
      respondent_name: 'Kaduna State Commercial Ltd',
      division_station: 'High Court Division 1 Kaduna',
    },
    status: 'PAID',
    createdAt: demoPaidAt,
    paidAt: demoPaidAt,
    receiptNo: demoReceiptNo,
  },
  {
    internalTxnId: 'TXN-20261006-99120',
    paymentReference: 'KJ202610069A12BC',
    gatewayRef: 'GW-PAY-112094',
    payerName: 'Fatima Sanusi',
    payerEmail: 'fatima.sanusi@example.com',
    payerPhone: '+234 802 888 9911',
    serviceId: 'srv-003',
    serviceName: 'Probate Application & Letters of Administration',
    category: 'Probate Registry',
    courtDivision: 'Probate Registry Kaduna',
    quantity: 1,
    unitPrice: 75000,
    totalAmount: 75000,
    fieldData: {
      file_number: 'PROB/KD/2026/44',
      applicant_name: 'Fatima Sanusi',
      purpose_of_payment: 'Grant of Probate for Late Estate',
    },
    status: 'PAID',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    paidAt: new Date(Date.now() - 3600000).toISOString(),
    receiptNo: 'KJRC-2026-000002',
  },
  {
    internalTxnId: 'TXN-20261006-44129',
    paymentReference: 'KJ202610065C7711',
    payerName: 'Usman Garba',
    payerEmail: 'usman.garba@example.com',
    payerPhone: '+234 809 111 2233',
    serviceId: 'srv-004',
    serviceName: 'Certified True Copy (CTC) of Judgment',
    category: 'Certifications & Copies',
    courtDivision: 'High Court Kaduna',
    quantity: 10,
    unitPrice: 2000,
    totalAmount: 20000,
    fieldData: {
      case_number: 'KDH/CV/2025/99',
      applicant_name: 'Usman Garba',
    },
    status: 'PENDING',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  }
];

const initialReceipts: ElectronicReceipt[] = [
  {
    receiptNo: demoReceiptNo,
    paymentReference: demoPaymentRef,
    internalTxnId: 'TXN-20261006-88192',
    gatewayRef: 'GW-PAY-992104',
    payerName: 'John Doe',
    payerEmail: 'johndoe@example.com',
    payerPhone: '+234 803 123 4567',
    serviceName: 'Court Filing Fee',
    category: 'Court Fees',
    courtDivision: 'High Court Kaduna',
    quantity: 1,
    unitPrice: 50000,
    amount: 50000,
    paidAt: demoPaidAt,
    status: 'PAID',
    verificationUrl: `/verify/${demoPaymentRef}`,
    fieldData: {
      suit_number: 'KDH/HC/2026/102',
      applicant_name: 'John Doe',
      respondent_name: 'Kaduna State Commercial Ltd',
      division_station: 'High Court Division 1 Kaduna',
    },
    officialAuthority: 'Kaduna State Judiciary',
    technologyPartner: 'WTC Nigeria Limited',
  },
  {
    receiptNo: 'KJRC-2026-000002',
    paymentReference: 'KJ202610069A12BC',
    internalTxnId: 'TXN-20261006-99120',
    gatewayRef: 'GW-PAY-112094',
    payerName: 'Fatima Sanusi',
    payerEmail: 'fatima.sanusi@example.com',
    payerPhone: '+234 802 888 9911',
    serviceName: 'Probate Application & Letters of Administration',
    category: 'Probate Registry',
    courtDivision: 'Probate Registry Kaduna',
    quantity: 1,
    unitPrice: 75000,
    amount: 75000,
    paidAt: new Date(Date.now() - 3600000).toISOString(),
    status: 'PAID',
    verificationUrl: `/verify/KJ202610069A12BC`,
    fieldData: {
      file_number: 'PROB/KD/2026/44',
      applicant_name: 'Fatima Sanusi',
    },
    officialAuthority: 'Kaduna State Judiciary',
    technologyPartner: 'WTC Nigeria Limited',
  }
];

const initialStaff: StaffRecord[] = [
  {
    id: 'STF-001',
    fullName: 'Hon. Justice Ibrahim Bello',
    email: 'auditor@judiciary.kd.gov.ng',
    role: 'JUDICIARY_AUDITOR',
    courtDivision: 'Kaduna Judicial Headquarters',
    phone: '+234 803 100 2000',
    status: 'ACTIVE',
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'STF-002',
    fullName: 'Amina Yusuf',
    email: 'officer@judiciary.kd.gov.ng',
    role: 'JUDICIARY_REVENUE_OFFICER',
    courtDivision: 'High Court Division 1 Kaduna',
    phone: '+234 803 222 3344',
    status: 'ACTIVE',
    createdAt: '2026-02-15T09:30:00Z',
  },
  {
    id: 'STF-003',
    fullName: 'Abubakar Shehu',
    email: 'shehu.revenue@judiciary.kd.gov.ng',
    role: 'JUDICIARY_REVENUE_OFFICER',
    courtDivision: 'Magistrate Court Kaduna',
    phone: '+234 806 555 6677',
    status: 'ACTIVE',
    createdAt: '2026-03-01T10:15:00Z',
  },
  {
    id: 'STF-004',
    fullName: 'Engr. David Okafor',
    email: 'admin@wtc.ng',
    role: 'WTC_TECH_ADMIN',
    courtDivision: 'WTC Technology Operations Hub',
    phone: '+234 802 999 8877',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
  }
];

const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: demoPaidAt,
    action: 'RECEIPT_ISSUED',
    actor: 'WTC_PAYMENT_WEBHOOK',
    details: `Official Electronic Receipt ${demoReceiptNo} generated for Reference ${demoPaymentRef}`,
    reference: demoPaymentRef,
  },
  {
    id: 'log-000',
    timestamp: demoPaidAt,
    action: 'SYSTEM_BOOT',
    actor: 'SYSTEM',
    details: 'WTC Kaduna State Judiciary Revenue Collection System v1.0 Initialized',
  },
];

let receiptCounter = 2;

class InStoreDatabase {
  private services: JudiciaryService[] = [...initialServices];
  private payments: PaymentAttempt[] = [...initialPayments];
  private receipts: ElectronicReceipt[] = [...initialReceipts];
  private staff: StaffRecord[] = [...initialStaff];
  private auditLogs: AuditLog[] = [...initialAuditLogs];

  getServices(category?: string): JudiciaryService[] {
    if (category && category !== 'ALL') {
      return this.services.filter(s => s.category.toLowerCase() === category.toLowerCase() && s.status === 'ACTIVE');
    }
    return this.services.filter(s => s.status === 'ACTIVE');
  }

  getServiceById(id: string): JudiciaryService | undefined {
    return this.services.find(s => s.id === id);
  }

  saveService(service: JudiciaryService): JudiciaryService {
    const existingIdx = this.services.findIndex(s => s.id === service.id);
    if (existingIdx >= 0) {
      this.services[existingIdx] = service;
    } else {
      this.services.push(service);
    }
    this.addAuditLog('SERVICE_CONFIG_UPDATED', 'JUDICIARY_ADMIN', `Updated tariff config for ${service.name} (${service.code})`);
    return service;
  }

  // Staff Management
  getStaffRecords(): StaffRecord[] {
    return [...this.staff];
  }

  addStaffRecord(params: Omit<StaffRecord, 'id' | 'createdAt'>): StaffRecord {
    const newStaff: StaffRecord = {
      ...params,
      id: `STF-${String(this.staff.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
    };
    this.staff.push(newStaff);
    this.addAuditLog('STAFF_RECORD_CREATED', 'JUDICIARY_ADMIN', `Added staff record for ${newStaff.fullName} (${newStaff.role})`);
    return newStaff;
  }

  // Payments & Receipts
  getAllPayments(): PaymentAttempt[] {
    return [...this.payments].reverse();
  }

  getAllReceipts(): ElectronicReceipt[] {
    return [...this.receipts].reverse();
  }

  initiatePayment(params: {
    payerName: string;
    payerEmail: string;
    payerPhone: string;
    serviceId: string;
    quantity: number;
    fieldData: Record<string, string>;
  }): PaymentAttempt {
    const service = this.getServiceById(params.serviceId);
    if (!service) {
      throw new Error('Selected Judiciary service not found.');
    }

    const qty = Math.max(1, params.quantity || 1);
    const unitPrice = service.amount;
    const totalAmount = service.feeModel === 'VARIABLE' ? unitPrice * qty : unitPrice;

    const internalTxnId = generateInternalTxnId();
    const paymentReference = generatePaymentReference();

    const payment: PaymentAttempt = {
      internalTxnId,
      paymentReference,
      payerName: params.payerName,
      payerEmail: params.payerEmail,
      payerPhone: params.payerPhone,
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      courtDivision: service.courtType,
      quantity: qty,
      unitPrice,
      totalAmount,
      fieldData: params.fieldData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.payments.push(payment);
    this.addAuditLog(
      'PAYMENT_INITIATED', 
      'PUBLIC_USER', 
      `Payment reference ${paymentReference} generated for ${payment.payerName} (${service.name} - ₦${totalAmount.toLocaleString()})`, 
      paymentReference
    );

    return payment;
  }

  getPaymentByReference(ref: string): PaymentAttempt | undefined {
    const cleanRef = ref.trim().toUpperCase();
    return this.payments.find(p => p.paymentReference.toUpperCase() === cleanRef || p.internalTxnId.toUpperCase() === cleanRef);
  }

  processPaymentWebhook(params: {
    paymentReference: string;
    gatewayTransactionId?: string;
    status: 'PAID' | 'FAILED' | 'CANCELLED';
  }): { success: boolean; payment?: PaymentAttempt; receipt?: ElectronicReceipt; message: string } {
    const payment = this.getPaymentByReference(params.paymentReference);
    if (!payment) {
      return { success: false, message: 'Payment reference not found.' };
    }

    if (payment.status === 'PAID') {
      const receipt = this.getReceiptByPaymentReference(payment.paymentReference);
      return { success: true, payment, receipt, message: 'Payment already verified and paid.' };
    }

    if (params.status !== 'PAID') {
      payment.status = params.status;
      this.addAuditLog(
        'PAYMENT_FAILED_OR_CANCELLED', 
        'PAYMENT_GATEWAY_WEBHOOK', 
        `Payment ${payment.paymentReference} marked ${params.status}`, 
        payment.paymentReference
      );
      return { success: false, payment, message: `Payment gateway reported status: ${params.status}` };
    }

    const gatewayRef = params.gatewayTransactionId || generateGatewayRef();
    receiptCounter++;
    const receiptNo = `KJRC-2026-${String(receiptCounter).padStart(6, '0')}`;
    const paidAt = new Date().toISOString();

    payment.status = 'PAID';
    payment.paidAt = paidAt;
    payment.gatewayRef = gatewayRef;
    payment.receiptNo = receiptNo;

    const receipt: ElectronicReceipt = {
      receiptNo,
      paymentReference: payment.paymentReference,
      internalTxnId: payment.internalTxnId,
      gatewayRef,
      payerName: payment.payerName,
      payerEmail: payment.payerEmail,
      payerPhone: payment.payerPhone,
      serviceName: payment.serviceName,
      category: payment.category,
      courtDivision: payment.courtDivision,
      quantity: payment.quantity,
      unitPrice: payment.unitPrice,
      amount: payment.totalAmount,
      paidAt,
      status: 'PAID',
      verificationUrl: `/verify/${payment.paymentReference}`,
      fieldData: payment.fieldData,
      officialAuthority: 'Kaduna State Judiciary',
      technologyPartner: 'WTC Nigeria Limited',
    };

    this.receipts.push(receipt);

    this.addAuditLog(
      'PAYMENT_VERIFIED_AND_RECEIPT_GENERATED',
      'WTC_PAYMENT_WEBHOOK',
      `Payment ${payment.paymentReference} verified via Webhook (Gateway ID: ${gatewayRef}). Official Receipt ${receiptNo} issued for ₦${payment.totalAmount.toLocaleString()}.`,
      payment.paymentReference
    );

    return { success: true, payment, receipt, message: 'Payment verified and official receipt generated.' };
  }

  getReceipt(searchQuery: string): ElectronicReceipt | undefined {
    const clean = searchQuery.trim().toUpperCase();
    return this.receipts.find(
      r => r.receiptNo.toUpperCase() === clean || r.paymentReference.toUpperCase() === clean || r.internalTxnId.toUpperCase() === clean
    );
  }

  getReceiptByPaymentReference(ref: string): ElectronicReceipt | undefined {
    return this.getReceipt(ref);
  }

  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].reverse();
  }

  private addAuditLog(action: string, actor: string, details: string, reference?: string) {
    this.auditLogs.push({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      actor,
      details,
      reference,
    });
  }

  getStats(): SystemStats {
    const totalRevenue = this.receipts.reduce((acc, r) => acc + r.amount, 0);
    return {
      totalRevenue,
      totalTransactions: this.payments.length,
      verifiedReceiptsCount: this.receipts.length,
      activeServicesCount: this.services.filter(s => s.status === 'ACTIVE').length,
      totalStaffCount: this.staff.length,
    };
  }
}

const globalForDb = global as unknown as { dbInstance: InStoreDatabase };
export const db = globalForDb.dbInstance || new InStoreDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.dbInstance = db;
