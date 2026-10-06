'use client';

import React from 'react';
import { HelpCircle, Phone, Mail, MapPin, Scale, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function HelpSupportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-amber-700" />
          Support & Helpdesk
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Help & Contact Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Need assistance with payment references, electronic receipts, or tariff calculations? Contact our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-700" />
            WTC Technical Helpdesk
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            For payment gateway issues, missing receipt emails, or technical reference queries, contact WTC platform support:
          </p>
          <div className="space-y-2 text-xs">
            <div className="text-slate-800">
              <strong>Hotline:</strong> +234 (0) 800 WTC KADUNA
            </div>
            <div className="text-slate-800">
              <strong>Email:</strong> revenue-support@wtc.ng
            </div>
            <div className="text-slate-800">
              <strong>Operating Hours:</strong> Monday – Friday (8:00 AM – 5:00 PM)
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-800" />
            Kaduna State Judiciary Registry
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            For suit numbers, case filings, probate applications, or judicial enquiries:
          </p>
          <div className="space-y-2 text-xs">
            <div className="text-slate-800">
              <strong>High Court Headquarters:</strong> Bida Road, Kaduna State, Nigeria
            </div>
            <div className="text-slate-800">
              <strong>Probate Registry:</strong> High Court Division 1 Kaduna
            </div>
            <div className="text-slate-800">
              <strong>Sharia Court of Appeal:</strong> Kaduna Station
            </div>
          </div>
        </div>

      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-amber-800 block mb-1">How do I verify a receipt?</span>
            <p className="text-slate-600">Go to the Verify page and enter the Payment Reference or scan the QR Code on the receipt.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-amber-800 block mb-1">What if my payment failed?</span>
            <p className="text-slate-600">Your reference will remain pending or failed. You can re-initiate payment using the Check Status page.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
