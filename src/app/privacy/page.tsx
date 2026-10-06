'use client';

import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4 text-amber-700" />
          Data Protection & Privacy Policy
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          How Kaduna State Judiciary and WTC Nigeria Limited protect your transaction and personal data.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-xs text-slate-700 leading-relaxed shadow-md">
        
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
            1. Information Collection
          </h2>
          <p>
            When initiating payments for court fees or registry services, the system collects necessary identification data including Full Payer Name, Email Address, Phone Number, and case-specific details (such as Suit/Case Number or File Reference).
          </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
            2. Data Ownership & Processing Roles
          </h2>
          <p>
            All financial transaction records and judiciary logs are owned exclusively by the <strong>Kaduna State Judiciary</strong>. <strong>WTC Nigeria Limited</strong> processes data strictly as technical operator under non-disclosure agreements for platform processing, verification, and audit purposes.
          </p>
        </div>

        <div className="space-y-2 pt-4 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
            3. Security Standards
          </h2>
          <p>
            The system employs 256-bit SSL encryption for data in transit and secure database storage for audit trails. Payment card details are never stored on WTC or Judiciary servers; payments are processed securely through PCI-DSS compliant gateway providers.
          </p>
        </div>

      </div>

    </div>
  );
}
