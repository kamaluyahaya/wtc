'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Scale, 
  CreditCard, 
  FileCheck, 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  Zap, 
  Lock, 
  Award, 
  HelpCircle,
  Building2
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [quickRef, setQuickRef] = useState('');

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickRef.trim()) {
      router.push(`/verify?query=${encodeURIComponent(quickRef.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section matching prompt diagram requirement */}
      <section className="relative overflow-hidden pt-10 pb-16 bg-gradient-to-b from-slate-100 via-emerald-50/40 to-slate-50 border-b border-slate-200">
        
        {/* Subtle decorative pattern background */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Main Hero Card Container */}
          <div className="bg-white/95 rounded-3xl border border-slate-200/90 p-8 sm:p-12 lg:p-16 shadow-xl backdrop-blur-xl">
            
            {/* Top Sub-branding */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 font-extrabold flex items-center justify-center text-sm shadow-xs">
                  WTC
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                    Software Technology Partner
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    WTC Nigeria Limited
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">
                    Statutory Revenue Authority
                  </span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 justify-end">
                    <Scale className="w-4 h-4 text-amber-600" />
                    Kaduna State Judiciary
                  </span>
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Kaduna State Judiciary Revenue Collection System v1.0
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Pay Kaduna State Judiciary Fees Online
              </h1>

              {/* Tagline */}
              <p className="text-base sm:text-xl font-bold text-amber-700 tracking-wider flex items-center justify-center gap-3 flex-wrap">
                <span>Secure</span>
                <span>•</span>
                <span>Fast</span>
                <span>•</span>
                <span>Convenient</span>
                <span>•</span>
                <span>Verifiable</span>
              </p>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Seamlessly initiate payments for High Court, Magistrate Court, Probate Registry, and Sharia Court fees. Generate unique payment references and instantly download officially verified electronic receipts.
              </p>

              {/* Primary Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/pay"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-3"
                >
                  <CreditCard className="w-5 h-5" />
                  Make Payment
                </Link>

                <Link
                  href="/verify"
                  className="px-8 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base border border-emerald-900 shadow-lg shadow-emerald-950/10 transition-all transform hover:-translate-y-0.5 flex items-center gap-3"
                >
                  <FileCheck className="w-5 h-5 text-amber-400" />
                  Verify Receipt
                </Link>
              </div>
            </div>

            {/* Quick Verification Search Box Embedded in Hero */}
            <div className="mt-12 pt-8 border-t border-slate-200 max-w-2xl mx-auto">
              <form onSubmit={handleQuickVerify} className="space-y-2">
                <label className="block text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Quick Receipt or Reference Verification
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={quickRef}
                    onChange={(e) => setQuickRef(e.target.value)}
                    placeholder="Enter Payment Ref (e.g. KJ202610068F4A72) or Receipt No (e.g. KJRC-2026-000001)..."
                    className="w-full pl-4 pr-32 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm font-mono shadow-inner"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Search className="w-3.5 h-3.5 text-amber-400" />
                    Verify
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* Main Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Core Portal Capabilities
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need for Kaduna State Judiciary electronic revenue processing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <Link 
            href="/pay" 
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-500 transition-all hover:shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                1. Make Payment
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Select your court division and service to generate your unique payment reference and pay securely.
              </p>
            </div>
            <div className="text-xs font-semibold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Start Payment <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link 
            href="/verify" 
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-600 transition-all hover:shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                2. Verify Receipt
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Verify authentic electronic receipts using receipt numbers or scanning the embedded dynamic QR code.
              </p>
            </div>
            <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Verify Now <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link 
            href="/status" 
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-600 transition-all hover:shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                3. Check Payment Status
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Track pending, successful or processing transactions using your generated payment reference.
              </p>
            </div>
            <div className="text-xs font-semibold text-blue-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Check Status <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link 
            href="/catalogue" 
            className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-600 transition-all hover:shadow-lg space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                4. Tariffs Catalogue
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Explore the complete approved Judiciary fee schedule across High Court, Probate, Sharia & Magistrate divisions.
              </p>
            </div>
            <div className="text-xs font-semibold text-purple-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Browse Catalogue <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>
      </section>

      {/* Featured Approved Tariffs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Popular Approved Judiciary Services</h2>
              <p className="text-xs text-slate-500">Official fees approved by Kaduna State Judiciary Revenue Authority</p>
            </div>
            <Link 
              href="/catalogue" 
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              View Full Tariff Schedule <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  HIGH COURT
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">Court Filing Fee</h4>
                <p className="text-xs text-slate-600 mt-0.5">Civil suit, motion or originating summons</p>
              </div>
              <span className="font-mono font-bold text-amber-700 text-sm">₦50,000.00</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  PROBATE REGISTRY
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">Letters of Administration</h4>
                <p className="text-xs text-slate-600 mt-0.5">Grant of probate estate processing</p>
              </div>
              <span className="font-mono font-bold text-amber-700 text-sm">₦75,000.00</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-300">
                  CERTIFICATIONS
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2">Certified True Copy (CTC)</h4>
                <p className="text-xs text-slate-600 mt-0.5">Calculated per copy rate</p>
              </div>
              <span className="font-mono font-bold text-amber-700 text-sm">₦2,000 / copy</span>
            </div>

          </div>
        </div>
      </section>

      {/* Security & Strict Verification Rule Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 rounded-3xl border border-emerald-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl text-white">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wide">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Automated Gateway Webhook Verification Engine
            </div>
            <h3 className="text-xl font-bold text-white">
              Strict Fraud Prevention & Official Verification
            </h3>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Official electronic receipts are generated strictly after real-time backend webhook verification with the payment provider. This guarantees complete audit transparency and prevents unauthorized receipts.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href="/pay"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md"
            >
              Initiate Payment Now
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
