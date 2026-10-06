'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PaymentAttempt } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Smartphone, 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Scale
} from 'lucide-react';

export default function PaymentGatewaySimulationPage() {
  const params = useParams();
  const router = useRouter();
  const reference = (params?.reference as string) || '';

  const [payment, setPayment] = useState<PaymentAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [payMethod, setPayMethod] = useState<'CARD' | 'BANK' | 'USSD'>('CARD');

  // Simulated Card input
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');

  useEffect(() => {
    if (reference) {
      fetchStatus();
    }
  }, [reference]);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/payments/status?ref=${encodeURIComponent(reference)}`);
      const data = await res.json();
      if (data.success && data.payment) {
        setPayment(data.payment);
        if (data.payment.status === 'PAID') {
          router.push(`/receipt/${data.payment.paymentReference}`);
        }
      } else {
        setErrorMsg('Invalid or expired payment reference.');
      }
    } catch (e: any) {
      setErrorMsg('Failed to connect to gateway verification server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorizePayment = async (statusOverride: 'PAID' | 'FAILED' = 'PAID') => {
    if (!payment) return;
    setProcessing(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentReference: payment.paymentReference,
          gatewayTransactionId: `GW-SIM-${Date.now()}`,
          status: statusOverride,
        }),
      });

      const data = await response.json();

      if (data.success && data.receipt) {
        router.push(`/receipt/${payment.paymentReference}`);
      } else if (statusOverride === 'FAILED') {
        setErrorMsg('Payment authorization declined by issuing bank.');
      } else {
        setErrorMsg(data.message || 'Payment verification failed.');
      }
    } catch (e: any) {
      setErrorMsg('Webhook network error during payment verification.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <RefreshCw className="w-10 h-10 text-amber-600 animate-spin mx-auto" />
        <p className="text-slate-600 text-sm">Connecting to WTC Secure Payment Gateway...</p>
      </div>
    );
  }

  if (errorMsg && !payment) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4 bg-white border border-slate-200 p-8 rounded-3xl shadow-md">
        <AlertTriangle className="w-12 h-12 text-red-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Payment Gateway Error</h2>
        <p className="text-xs text-slate-600">{errorMsg}</p>
        <button
          onClick={() => router.push('/pay')}
          className="px-6 py-2.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
        >
          Return to Payment Initiation
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      
      {/* Payment Gateway Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-3 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs">
              WTC
            </div>
            <span className="text-xs font-bold text-slate-900 tracking-wide">
              WTC Payment Gateway
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold">
            <Lock className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <div className="pt-2">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">
            Payment for Kaduna State Judiciary
          </span>
          <h1 className="text-lg font-extrabold text-slate-900">
            {payment?.serviceName}
          </h1>
          <p className="text-xs text-amber-700 font-mono mt-0.5">
            Ref: {payment?.paymentReference}
          </p>
        </div>

        {/* Amount Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-600">Total Amount Payable:</span>
          <span className="text-2xl font-black font-mono text-emerald-800">
            {formatCurrency(payment?.totalAmount || 0)}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Payment Method Selector Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs">
          <button
            onClick={() => setPayMethod('CARD')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
              payMethod === 'CARD' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Card Payment
          </button>
          <button
            onClick={() => setPayMethod('BANK')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
              payMethod === 'BANK' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" /> Bank Transfer
          </button>
          <button
            onClick={() => setPayMethod('USSD')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors ${
              payMethod === 'USSD' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4" /> USSD Code
          </button>
        </div>

        {/* Option 1: Card Simulation */}
        {payMethod === 'CARD' && (
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">CVV</label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Option 2: Bank Transfer Simulation */}
        {payMethod === 'BANK' && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Bank Name:</span>
              <span className="font-bold text-slate-900">WTC Kaduna Judiciary Collection Bank</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Virtual Account Number:</span>
              <span className="font-mono font-bold text-amber-700 text-base">9920148812</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Account Name:</span>
              <span className="font-semibold text-slate-800">Kaduna State Judiciary - WTC Collection</span>
            </div>
            <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-200">
              Transfer exact amount to the account above. Webhook will auto-trigger upon bank signal.
            </p>
          </div>
        )}

        {/* Option 3: USSD Simulation */}
        {payMethod === 'USSD' && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2 text-xs">
            <span className="text-slate-600">Dial the USSD String on your registered phone:</span>
            <div className="text-xl font-bold font-mono text-amber-700 bg-white py-3 rounded-xl border border-slate-300 shadow-xs">
              *999*014*{payment?.paymentReference.slice(-6)}#
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => handleAuthorizePayment('PAID')}
            disabled={processing}
            className="w-full py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
          >
            {processing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" /> Verifying Webhook Response...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                Authorize Payment & Trigger Backend Verification
              </>
            )}
          </button>

          {/* Test failure simulation */}
          <button
            onClick={() => handleAuthorizePayment('FAILED')}
            disabled={processing}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-red-700 text-xs font-semibold border border-red-200 transition-colors"
          >
            Simulate Gateway Payment Failure
          </button>
        </div>

        {/* Notice of Strict Rule */}
        <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 inline mr-1" />
          Receipt generation is governed strictly by backend webhook verification.
        </div>
      </div>

    </div>
  );
}
