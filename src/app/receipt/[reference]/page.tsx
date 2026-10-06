'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ElectronicReceipt } from '@/lib/types';
import ReceiptPrintView from '@/components/ReceiptPrintView';
import { RefreshCw, AlertCircle, Scale, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerifiedReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const reference = (params?.reference as string) || '';

  const [receipt, setReceipt] = useState<ElectronicReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (reference) {
      fetchReceipt();
    }
  }, [reference]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/verify?query=${encodeURIComponent(reference)}`);
      const data = await res.json();
      if (data.success && data.verified && data.receipt) {
        setReceipt(data.receipt);
      } else {
        setErrorMsg(data.message || 'Official receipt could not be found or verified.');
      }
    } catch (e: any) {
      setErrorMsg('Failed to load official electronic receipt.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Verifying official receipt authenticity with Kaduna Judiciary Registry...</p>
      </div>
    );
  }

  if (errorMsg || !receipt) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4 shadow-xl">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">Receipt Verification Issue</h2>
          <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href={`/status?ref=${reference}`}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl"
            >
              Check Payment Status
            </Link>
            <Link
              href="/verify"
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl"
            >
              Return to Verification Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8">
      <ReceiptPrintView receipt={receipt} />
    </div>
  );
}
