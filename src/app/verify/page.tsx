'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ElectronicReceipt, PaymentAttempt } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import PageSuspenseFallback from '@/components/PageSuspenseFallback';
import { 
  FileCheck, 
  Search, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Scale, 
  Printer, 
  ArrowRight,
  Camera,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

function VerificationModulePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('query') || searchParams.get('ref') || '';

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    verified: boolean;
    receipt?: ElectronicReceipt;
    paymentAttempt?: PaymentAttempt;
    message: string;
  } | null>(null);

  const [showQrScanner, setShowQrScanner] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performVerification(initialQuery);
    }
  }, [initialQuery]);

  const performVerification = async (searchStr: string) => {
    if (!searchStr.trim()) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/verify?query=${encodeURIComponent(searchStr.trim())}`);
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setResult({
        found: false,
        verified: false,
        message: 'Network error connecting to official verification registry.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(query);
  };

  const handleSimulateQrScan = () => {
    setShowQrScanner(true);
    setTimeout(() => {
      setShowQrScanner(false);
      setQuery('KJ202610068F4A72');
      performVerification('KJ202610068F4A72');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          Official Verification Portal
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Receipt Verification & Authenticity Audit
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Verify official Kaduna State Judiciary electronic receipts instantly by Receipt Number, Payment Reference, or QR Code.
        </p>
      </div>

      {/* Verification Input Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-md">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Enter Receipt No, Payment Reference, or Internal Txn ID:
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. KJRC-2026-000001 or KJ202610068F4A72..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4 text-amber-400" />}
              Verify Receipt
            </button>
          </div>
        </form>

        {/* Quick Actions & QR Scanner Simulator */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={handleSimulateQrScan}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 flex items-center gap-2 transition-colors"
          >
            <Camera className="w-4 h-4 text-amber-700" />
            Scan QR Code Camera Simulator
          </button>

          <div className="flex items-center gap-2 text-slate-600 text-[11px]">
            <span>Try Demo Reference:</span>
            <button
              onClick={() => {
                setQuery('KJ202610068F4A72');
                performVerification('KJ202610068F4A72');
              }}
              className="font-mono text-amber-700 font-bold hover:underline"
            >
              KJ202610068F4A72
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Camera Simulator Modal */}
      {showQrScanner && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 text-slate-900 shadow-2xl">
            <div className="relative w-48 h-48 mx-auto border-2 border-dashed border-amber-600 rounded-2xl flex items-center justify-center bg-slate-50 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-amber-500/10 animate-pulse" />
              <QrCode className="w-24 h-24 text-amber-600 animate-bounce" />
            </div>
            <p className="text-xs font-bold text-emerald-800">Scanning Receipt QR Code...</p>
            <p className="text-[11px] text-slate-500">Position the receipt QR code in front of camera.</p>
          </div>
        </div>
      )}

      {/* Verification Result Output */}
      {searched && result && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 shadow-md">
          
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              {result.verified ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-400 text-emerald-800 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-400 text-red-700 flex items-center justify-center shadow-xs">
                  <XCircle className="w-7 h-7" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-0.5 rounded-full text-xs font-black tracking-wider ${
                    result.verified 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}>
                    {result.verified ? 'VALID RECEIPT' : 'INVALID / UNVERIFIED'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {result.message}
                </h3>
              </div>
            </div>
          </div>

          {result.verified && result.receipt && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px] block">Receipt Number:</span>
                  <span className="font-mono font-extrabold text-amber-700 text-base">{result.receipt.receiptNo}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px] block">Payment Reference:</span>
                  <span className="font-mono font-extrabold text-slate-900 text-base">{result.receipt.paymentReference}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px] block">Payer Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{result.receipt.payerName}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px] block">Collection Service:</span>
                  <span className="font-bold text-slate-800">{result.receipt.serviceName}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px] block">Court / Station:</span>
                  <span className="font-semibold text-emerald-800">{result.receipt.courtDivision}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px] block">Payment Date:</span>
                  <span className="font-medium text-slate-700">{formatDate(result.receipt.paidAt)}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px] block">Verified Amount:</span>
                  <span className="font-mono font-black text-amber-700 text-lg">{formatCurrency(result.receipt.amount)}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-500 text-[11px] block">Verification Status:</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PAID & VERIFIED
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 text-[11px]">
                  Issued by <strong>Kaduna State Judiciary</strong> • Managed by <strong>WTC Nigeria Limited</strong>
                </span>
                <Link
                  href={`/receipt/${result.receipt.paymentReference}`}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  View Full Official Electronic Receipt <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {result.found && !result.verified && result.paymentAttempt && (
            <div className="bg-slate-50 rounded-2xl border border-amber-300 p-6 space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Payment Reference Found:</span>
                <span className="font-mono font-bold text-amber-700">{result.paymentAttempt.paymentReference}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Current Status:</span>
                <span className="font-bold text-amber-700 uppercase">{result.paymentAttempt.status}</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                This payment reference exists but has not been verified as PAID. Official receipts are issued only after payment gateway confirmation.
              </p>
              <Link
                href={`/gateway/${result.paymentAttempt.paymentReference}`}
                className="inline-block px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Complete Payment Now
              </Link>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default function VerificationModulePage() {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <VerificationModulePageContent />
    </Suspense>
  );
}
