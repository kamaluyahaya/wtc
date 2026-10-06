export type FeeModel = 'FIXED' | 'VARIABLE';

export type RequiredFieldKey = 
  | 'case_number'
  | 'suit_number'
  | 'file_number'
  | 'applicant_name'
  | 'respondent_name'
  | 'lawyer_chambers'
  | 'division_station'
  | 'purpose_of_payment';

export interface DynamicFieldConfig {
  key: RequiredFieldKey;
  label: string;
  placeholder: string;
  required: boolean;
}

export interface JudiciaryService {
  id: string;
  code: string;
  category: string;
  name: string;
  description: string;
  courtType: string;
  feeModel: FeeModel;
  amount: number;
  unitLabel?: string;
  requiredFields: RequiredFieldKey[];
  status: 'ACTIVE' | 'INACTIVE';
}

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface PaymentAttempt {
  internalTxnId: string;
  paymentReference: string;
  gatewayRef?: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  serviceId: string;
  serviceName: string;
  category: string;
  courtDivision: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  fieldData: Record<string, string>;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string;
  receiptNo?: string;
}

export interface ElectronicReceipt {
  receiptNo: string;
  paymentReference: string;
  internalTxnId: string;
  gatewayRef: string;
  payerName: string;
  payerEmail: string;
  payerPhone: string;
  serviceName: string;
  category: string;
  courtDivision: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  paidAt: string;
  status: 'PAID';
  verificationUrl: string;
  fieldData: Record<string, string>;
  officialAuthority: string;
  technologyPartner: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  reference?: string;
}

export type StaffRole = 'JUDICIARY_REVENUE_OFFICER' | 'JUDICIARY_AUDITOR' | 'WTC_TECH_ADMIN';

export interface StaffRecord {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
  courtDivision: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface SystemStats {
  totalRevenue: number;
  totalTransactions: number;
  verifiedReceiptsCount: number;
  activeServicesCount: number;
  totalStaffCount: number;
}
