import { DynamicFieldConfig, RequiredFieldKey } from './types';

/**
 * Generate unique, non-sequential, hard-to-guess payment reference
 * Format: KJ + YYYYMMDD + 6 Random Alphanumeric Hex characters
 * Example: KJ202610068F4A72
 */
export function generatePaymentReference(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0');
  return `KJ${dateStr}${randomHex}`;
}

/**
 * Generate Internal Transaction ID
 * Example: TXN-20261006-94812
 */
export function generateInternalTxnId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randDigit = Math.floor(10000 + Math.random() * 90000);
  return `TXN-${dateStr}-${randDigit}`;
}

/**
 * Generate Gateway Reference
 * Example: GW-PAY-882194
 */
export function generateGatewayRef(): string {
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `GW-PAY-${rand}`;
}

/**
 * Format Currency in Nigerian Naira (₦)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format Date String
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

/**
 * Configuration mapping for conditional dynamic payment form fields
 */
export const DYNAMIC_FIELD_CONFIGS: Record<RequiredFieldKey, DynamicFieldConfig> = {
  case_number: {
    key: 'case_number',
    label: 'Case / Charge Number',
    placeholder: 'e.g. KDH/HC/2026/142',
    required: true,
  },
  suit_number: {
    key: 'suit_number',
    label: 'Suit Number',
    placeholder: 'e.g. KDH/CV/2026/089',
    required: true,
  },
  file_number: {
    key: 'file_number',
    label: 'Judiciary File Reference No.',
    placeholder: 'e.g. JUD/KD/REG/2026/77',
    required: true,
  },
  applicant_name: {
    key: 'applicant_name',
    label: 'Applicant / Plaintiff Name',
    placeholder: 'Enter full name of applicant',
    required: true,
  },
  respondent_name: {
    key: 'respondent_name',
    label: 'Respondent / Defendant Name',
    placeholder: 'Enter full name of respondent',
    required: false,
  },
  lawyer_chambers: {
    key: 'lawyer_chambers',
    label: 'Legal Counsel / Chambers (Optional)',
    placeholder: 'e.g. Balarabe & Co. Legal Practitioners',
    required: false,
  },
  division_station: {
    key: 'division_station',
    label: 'Judicial Division / Court Station',
    placeholder: 'Select or enter Judicial Division (e.g. High Court 1 Kaduna, Zaria Station)',
    required: true,
  },
  purpose_of_payment: {
    key: 'purpose_of_payment',
    label: 'Purpose / Details of Application',
    placeholder: 'Describe brief details of request',
    required: true,
  },
};
