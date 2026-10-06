'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentAttempt, ElectronicReceipt } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Search, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CheckPaymentStatusPage() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || '';

  const [refQuery, setRefQuery] = useState(initialRef);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [payment, setPayment] = useState<PaymentAttempt | null>(null);
  const [receipt, setReceipt] = useState<ElectronicReceipt | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialRef) {
      handleSearch(initialRef);
    }
  }, [initialRef]);

  const handleSearch = async (ref: string) => {
    if (!ref.trim()) return;
    setLoading(true);
    setSearched(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/payments/status?ref=${encodeURIComponent(ref.trim())}`);
      const data = await res.json();
      if (data.success && data.payment) {
        setPayment(data.payment);
        setReceipt(data.receipt || null);
      } else {
        setPayment(null);
        setReceipt(null);
        setErrorMsg(data.message || 'Payment reference not found.');
      }
    } catch (e: any) {
      setErrorMsg('Failed to check payment status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(refQuery);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-amber-700" />
          Real-Time Status Lookup
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Check Payment Status
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Enter your WTC/Judiciary Payment Reference to check payment and verification status.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={refQuery}
              onChange={(e) => setRefQuery(e.target.value)}
              placeholder="e.g. KJ202610068F4A72 or TXN-20261006-88192..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2"
          >
            {loading ? 'Searching...' : 'Check Status'}
          </button>
        </form>

        <div className="text-xs text-slate-600 flex items-center justify-between border-t border-slate-200 pt-3">
          <span>Try Demo Ref:</span>
          <button
            onClick={() => {
              setRefQuery('KJ202610068F4A72');
              handleSearch('KJ202610068F4A72');
            }}
            className="font-mono text-amber-700 font-bold hover:underline"
          >
            KJ202610068F4A72
          </button>
        </div>
      </div>

      {/* Result Display */}
      {searched && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-md">
          {errorMsg ? (
            <div className="text-center py-6 space-y-3">
              <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">Reference Not Found</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">{errorMsg}</p>
            </div>
          ) : payment ? (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">
                    Payment Reference
                  </span>
                  <span className="text-xl font-extrabold font-mono text-amber-700">
                    {payment.paymentReference}
                  </span>
                </div>

                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    payment.status === 'PAID' 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : payment.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Payer Name:</span>
                  <span className="font-bold text-slate-900">{payment.payerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Judiciary Service:</span>
                  <span className="font-semibold text-slate-800">{payment.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Court Division:</span>
                  <span className="font-semibold text-emerald-800">{payment.courtDivision}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Amount:</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">{formatCurrency(payment.totalAmount)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Created At:</span>
                  <span className="text-slate-700">{formatDate(payment.createdAt)}</span>
                </div>
                {payment.paidAt && (
                  <div>
                    <span className="text-slate-500 block">Verified Paid At:</span>
                    <span className="text-emerald-800 font-semibold">{formatDate(payment.paidAt)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-3">
                {payment.status === 'PENDING' && (
                  <Link
                    href={`/gateway/${payment.paymentReference}`}
                    className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs"
                  >
                    Proceed to Complete Payment
                  </Link>
                )}
                {payment.status === 'PAID' && receipt && (
                  <Link
                    href={`/receipt/${payment.paymentReference}`}
                    className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    View Official Electronic Receipt <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

            </div>
          ) : null}
        </div>
      )}

    </div>
  );
}
