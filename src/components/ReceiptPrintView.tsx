'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ElectronicReceipt } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Printer, Download, CheckCircle, ShieldCheck, Copy, Check, Scale, Share2 } from 'lucide-react';

interface ReceiptPrintViewProps {
  receipt: ElectronicReceipt;
}

export default function ReceiptPrintView({ receipt }: ReceiptPrintViewProps) {
  const [copied, setCopied] = useState(false);

  const fullVerificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${receipt.paymentReference}`
    : `https://judiciary-revenue.wtc.ng/verify/${receipt.paymentReference}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = () => {
    navigator.clipboard.writeText(receipt.paymentReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Action Bar (hidden when printing) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-white shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              Official Electronic Receipt Issued
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                VERIFIED PAID
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Receipt No: <span className="text-amber-400 font-mono font-bold">{receipt.receiptNo}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyRef}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Ref!' : 'Copy Reference'}
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition-all"
          >
            <Printer className="w-4 h-4" />
            Print / Save PDF Receipt
          </button>
        </div>
      </div>

      {/* Official Receipt Printable Card Layout */}
      <div className="receipt-card bg-white text-slate-900 p-8 sm:p-10 rounded-3xl shadow-2xl border-2 border-emerald-900 relative overflow-hidden">
        
        {/* Background Official Seal Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Scale className="w-96 h-96 text-emerald-900" />
        </div>

        {/* Header Header Seals & Logos */}
        <div className="border-b-2 border-emerald-900/80 pb-6 mb-6">
          <div className="flex items-center justify-between gap-4">
            
            {/* WTC Nigeria Badge */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-slate-950 text-amber-400 font-extrabold flex items-center justify-center text-sm shadow">
                WTC
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                  Technology Partner
                </span>
                <span className="font-extrabold text-xs text-slate-900 tracking-tight">
                  WTC NIGERIA LIMITED
                </span>
              </div>
            </div>

            {/* Kaduna Judiciary Crest */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900 text-emerald-100 font-bold text-xs uppercase tracking-wider mb-1">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                Kaduna State Judiciary
              </div>
              <p className="text-[10px] font-bold text-emerald-950 uppercase tracking-widest">
                Official Revenue Collection Receipt
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-dashed border-slate-300 text-center">
            <h1 className="text-xl sm:text-2xl font-extrabold text-emerald-950 uppercase tracking-wide">
              KADUNA STATE JUDICIARY
            </h1>
            <h2 className="text-xs font-bold text-slate-600 tracking-widest uppercase mt-0.5">
              Electronic Revenue Receipt
            </h2>
          </div>
        </div>

        {/* Key Identifiers Grid (Highlighting the 3 distinct IDs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl mb-6 text-xs">
          <div>
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
              Official Receipt No:
            </span>
            <span className="text-base font-black text-emerald-950 font-mono tracking-tight">
              {receipt.receiptNo}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
              Judiciary Payment Reference:
            </span>
            <span className="text-base font-black text-amber-700 font-mono tracking-tight">
              {receipt.paymentReference}
            </span>
          </div>

          <div className="pt-2 border-t border-emerald-200/60">
            <span className="text-[10px] font-medium text-slate-500 uppercase block">
              Internal Transaction ID:
            </span>
            <span className="font-mono font-semibold text-slate-700">
              {receipt.internalTxnId}
            </span>
          </div>

          <div className="pt-2 border-t border-emerald-200/60">
            <span className="text-[10px] font-medium text-slate-500 uppercase block">
              Gateway Transaction Ref:
            </span>
            <span className="font-mono font-semibold text-slate-700">
              {receipt.gatewayRef}
            </span>
          </div>
        </div>

        {/* Payer & Transaction Breakdown */}
        <div className="space-y-4 text-xs mb-8">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Payer & Payment Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
            <div>
              <span className="text-slate-500 block text-[11px]">Payer Full Name:</span>
              <span className="font-bold text-slate-900 text-sm">{receipt.payerName}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Email / Phone:</span>
              <span className="font-medium text-slate-800">{receipt.payerEmail} ({receipt.payerPhone})</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Judiciary Revenue Service:</span>
              <span className="font-bold text-slate-900 text-sm">{receipt.serviceName}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Court / Jurisdiction:</span>
              <span className="font-semibold text-emerald-900">{receipt.courtDivision}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Payment Date & Time:</span>
              <span className="font-medium text-slate-900">{formatDate(receipt.paidAt)}</span>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Payment Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5" />
                PAID
              </span>
            </div>
          </div>

          {/* Dynamic Field Breakdown if present */}
          {receipt.fieldData && Object.keys(receipt.fieldData).length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200 bg-slate-50 p-3 rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">
                Case / Judiciary Specific Details:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(receipt.fieldData).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}: </span>
                    <span className="font-semibold text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Total Payable Amount Banner */}
        <div className="bg-emerald-900 text-white p-5 rounded-2xl flex items-center justify-between mb-8 shadow-inner">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-widest block">
              Total Amount Collected
            </span>
            <span className="text-xs text-emerald-200">Official Judiciary Fee Paid</span>
          </div>
          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
              {formatCurrency(receipt.amount)}
            </span>
          </div>
        </div>

        {/* Bottom Security Seals & Dynamic QR Code Verification Section */}
        <div className="border-t-2 border-emerald-900/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {/* Live QR Code */}
            <div className="p-2 bg-white border-2 border-emerald-900 rounded-xl shadow-md shrink-0">
              <QRCodeSVG
                value={fullVerificationUrl}
                size={96}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Scannable QR Verification Code
              </div>
              <p className="text-[11px] text-slate-600 max-w-xs leading-tight">
                Scan with any smartphone or camera to verify authenticity directly on the official WTC Kaduna Judiciary Portal.
              </p>
              <p className="text-[10px] text-slate-500 font-mono pt-1">
                {fullVerificationUrl}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200 space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Authority & Partner Sign-off
            </div>
            <div className="font-serif italic text-xs text-emerald-950 font-bold">
              Kaduna State Judiciary Revenue Authority
            </div>
            <div className="text-[10px] text-slate-600">
              Powered by <strong>WTC Nigeria Limited</strong>
            </div>
          </div>
        </div>

        {/* Notice Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
          This is an official computer-generated electronic receipt issued pursuant to Kaduna State Judiciary Revenue Guidelines. 
          No physical signature required. Fraudulent reproduction or alteration is strictly punishable by law.
        </div>

      </div>
    </div>
  );
}
