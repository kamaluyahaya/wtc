'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, ShieldCheck, Lock, Server } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-12 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Important Explicit Ownership & Partnership Separation Notice */}


        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200">

          {/* Col 1: System Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Scale className="w-5 h-5 text-amber-600" />
              <span>WTC Kaduna Judiciary Revenue</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed">
              Official electronic payment portal for court fees, probate registry tariffs, certifications, and judiciary services across Kaduna State judicial divisions.
            </p>
            <div className="flex items-center gap-2 text-emerald-800 text-xs pt-1 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Real-Time Webhook Verified Gateway</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase">Public Services</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pay" className="hover:text-emerald-800 transition-colors">
                  Make Judiciary Payment
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-emerald-800 transition-colors">
                  Verify Electronic Receipt
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="hover:text-emerald-800 transition-colors">
                  View Fee Schedule / Tariffs
                </Link>
              </li>
              <li>
                <Link href="/status" className="hover:text-emerald-800 transition-colors">
                  Check Payment Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Policies & SLA */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase">Legal & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/terms" className="hover:text-emerald-800 transition-colors">
                  Terms of Use & Operating Model
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-800 transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-emerald-800 transition-colors">
                  Helpdesk & Support Center
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-800 transition-colors flex items-center gap-1 text-slate-700">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  Staff Authorization Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Emergency Support */}
          <div className="space-y-3">
            <h4 className="text-slate-900 font-bold text-xs tracking-wider uppercase">Support & Contact</h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-700">
                <strong>Helpdesk Hotline:</strong> +234 (0) 800 WTC KADUNA
              </p>
              <p className="text-slate-700">
                <strong>Email Support:</strong> revenue-support@wtc.ng
              </p>
              <p className="text-slate-700">
                <strong>High Court Headquarters:</strong> Bida Road, Kaduna, Kaduna State, Nigeria.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security */}
        <div className="pt-6 flex flex-wrap justify-between items-center gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>Kaduna State Judiciary</strong>. All official rights reserved.
            Platform technology designed & operated by <strong>WTC Nigeria Limited</strong>.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-emerald-700" />
              v1.0 Production Engine
            </span>
            <span>•</span>
            <Link href="/terms" className="hover:underline">
              System SLA Agreement
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
