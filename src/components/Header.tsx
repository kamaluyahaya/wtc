'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, ShieldCheck, CreditCard, Search, FileCheck, HelpCircle, Menu, X, LayoutDashboard } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm">
      {/* Top Ownership / Partnership Announcement Bar */}
      {/* <div className="bg-emerald-950 py-1.5 px-4 text-xs text-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              OFFICIAL PORTAL
            </span>
            <span className="font-semibold text-white">Kaduna State Judiciary</span>
            <span className="text-emerald-400">•</span>
            <span>Managed by <strong className="text-amber-400 font-semibold">WTC Nigeria Limited</strong> (Technology Partner)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-200">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Secure 256-bit SSL Encrypted
            </span>
            <Link href="/help" className="hover:text-amber-400 transition-colors">
              Helpdesk & Support
            </Link>
          </div>
        </div>
      </div> */}

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logos & Titles */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Dual Brand Icon Emblem */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 border border-emerald-700 shadow-md group-hover:scale-105 transition-transform">
            <Scale className="w-6 h-6 text-amber-400" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[7px] font-extrabold text-slate-950">
              WTC
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                WTC <span className="text-emerald-800 font-extrabold">Judiciary Revenue</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 tracking-wide uppercase font-semibold">
              Kaduna State Judiciary Collection System
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <Link
            href="/"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${isActive('/')
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
          >
            Home
          </Link>
          <Link
            href="/pay"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${isActive('/pay')
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Make Payment
          </Link>
          <Link
            href="/verify"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${isActive('/verify')
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            Verify Receipt
          </Link>
          <Link
            href="/catalogue"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${isActive('/catalogue')
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
          >
            Tariff Catalogue
          </Link>
          <Link
            href="/status"
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${isActive('/status')
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
          >
            <Search className="w-3.5 h-3.5" />
            Check Status
          </Link>
        </nav>

        {/* Action Button & Admin Link */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
            Staff Portal
          </Link>
          <Link
            href="/pay"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md transition-all flex items-center gap-1.5"
          >
            <CreditCard className="w-4 h-4" />
            Pay Fees Now
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            href="/pay"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-bold bg-amber-500 text-slate-950"
          >
            Make Payment
          </Link>
          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Verify Official Receipt
          </Link>
          <Link
            href="/catalogue"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Revenue Services Catalogue
          </Link>
          <Link
            href="/status"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Check Payment Status
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-emerald-800 hover:bg-slate-100"
          >
            Staff Authorization Portal
          </Link>
          <Link
            href="/help"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Help & Contact Support
          </Link>
        </div>
      )}
    </header>
  );
}
