'use client';

import React from 'react';
import { Scale, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsOfUsePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4 text-amber-700" />
          Legal Framework & Platform Governance
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Terms of Use & Ownership Framework
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          WTC Kaduna State Judiciary Revenue Collection System — Version 1.0 Policy Document
        </p>
      </div>

      {/* Explicit Ownership Separation Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 text-xs text-slate-700 leading-relaxed shadow-md">
        
        <div className="border-b border-slate-200 pb-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
            1. Institutional Ownership & Operational Responsibilities
          </h2>
          <p className="text-slate-600 mt-1">
            Pursuant to the contract between Kaduna State Judiciary and WTC Nigeria Limited, system authority is strictly demarcated as follows:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-50 p-6 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Scale className="w-5 h-5 text-amber-700" />
              Kaduna State Judiciary Scope
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                Sole statutory Revenue Authority for Kaduna State.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                Determination of approved revenue heads and tariff schedules.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                Official receipt issuing authority.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                Sole owner of financial and judicial transaction records.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                Final authority on all judicial operations and case decisions.
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              WTC Nigeria Limited Scope
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                Official Software Provider and Technology Implementation Partner.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                Platform operator and support provider according to contract.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                Technical maintenance, server uptime, and software updates.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                Payment gateway integration and real-time webhook infrastructure.
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                Helpdesk technical support and security auditing.
              </li>
            </ul>
          </div>

        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
            2. Payment Verification & Receipt Validity Rules
          </h2>
          <p>
            Official electronic receipts are generated strictly upon backend verification of payment signals via secure webhooks from authorized payment gateways. Client-side navigation or manual returns do not constitute valid payment.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-200">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
            3. Scope Limitations (Phase 1)
          </h2>
          <p>
            This initial release (Version 1.0) is focused strictly on public revenue collection, receipt generation, verification, and administrative audit. Case management, e-filing, judge management, physical POS, cash collection, and mobile app features are outside the scope of Phase 1 unless explicitly commissioned.
          </p>
        </div>

      </div>

    </div>
  );
}
