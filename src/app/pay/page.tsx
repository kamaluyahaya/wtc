'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { JudiciaryService, RequiredFieldKey, PaymentAttempt } from '@/lib/types';
import { DYNAMIC_FIELD_CONFIGS, formatCurrency } from '@/lib/utils';
import PageSuspenseFallback from '@/components/PageSuspenseFallback';
import { 
  CreditCard, 
  Scale, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Building,
  AlertCircle
} from 'lucide-react';

function PaymentInitiationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialServiceId = searchParams.get('serviceId') || '';
  const initialQty = parseInt(searchParams.get('qty') || '1', 10);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [services, setServices] = useState<JudiciaryService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedService, setSelectedService] = useState<JudiciaryService | null>(null);

  // Form Fields
  const [payerName, setPayerName] = useState('');
  const [payerEmail, setPayerEmail] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [quantity, setQuantity] = useState<number>(initialQty);
  const [fieldData, setFieldData] = useState<Record<string, string>>({});

  // Payment Attempt Result state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedPayment, setGeneratedPayment] = useState<PaymentAttempt | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
        if (initialServiceId) {
          const match = data.services.find((s: JudiciaryService) => s.id === initialServiceId);
          if (match) setSelectedService(match);
        }
      }
    } catch (e) {
      console.error('Error loading services', e);
    }
  };

  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    const service = services.find(s => s.id === id) || null;
    setSelectedService(service);
    setFieldData({});
  };

  const handleFieldChange = (key: string, value: string) => {
    setFieldData(prev => ({ ...prev, [key]: value }));
  };

  const unitPrice = selectedService?.amount || 0;
  const isVariable = selectedService?.feeModel === 'VARIABLE';
  const totalPayable = isVariable ? unitPrice * Math.max(1, quantity) : unitPrice;

  const validateForm = () => {
    if (!selectedService) {
      setErrorMessage('Please select an approved Judiciary revenue service.');
      return false;
    }
    if (!payerName.trim()) {
      setErrorMessage('Please enter the Payer Full Name.');
      return false;
    }
    if (!payerEmail.trim() || !payerEmail.includes('@')) {
      setErrorMessage('Please enter a valid Email Address.');
      return false;
    }
    if (!payerPhone.trim()) {
      setErrorMessage('Please enter a valid Phone Number.');
      return false;
    }

    for (const reqKey of selectedService.requiredFields) {
      const config = DYNAMIC_FIELD_CONFIGS[reqKey];
      if (config && config.required && !fieldData[reqKey]?.trim()) {
        setErrorMessage(`Please fill in required field: "${config.label}"`);
        return false;
      }
    }

    setErrorMessage('');
    return true;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleGenerateReference = async () => {
    if (!selectedService) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payerName,
          payerEmail,
          payerPhone,
          serviceId: selectedService.id,
          quantity: isVariable ? quantity : 1,
          fieldData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedPayment(data.payment);
        setStep(3);
      } else {
        setErrorMessage(data.message || 'Failed to generate payment reference.');
      }
    } catch (e: any) {
      setErrorMessage(e.message || 'Server network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-2 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <CreditCard className="w-4 h-4 text-amber-700" />
          Official Revenue Payment Portal
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Initiate Judiciary Payment
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Generate your unique payment reference (`KJ2026...`) and proceed to online payment gateway verification.
        </p>

        {/* Step Progress Bar */}
        <div className="pt-6 max-w-lg mx-auto flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono ${step >= 1 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>1</span>
            Select & Fill Details
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono ${step >= 2 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>2</span>
            Review Payment
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center font-mono ${step >= 3 ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-200 text-slate-600'}`}>3</span>
            Gateway Launch
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Form Fill */}
      {step === 1 && (
        <form onSubmit={handleProceedToReview} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-8 shadow-md">
          
          {/* Section 1: Service Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Scale className="w-4 h-4 text-amber-700" />
              1. Select Approved Judiciary Service
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Revenue Category & Service Title *
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Choose Revenue Service --</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    [{s.category}] {s.name} - ({s.courtType}) - {formatCurrency(s.amount)} {s.unitLabel ? `(${s.unitLabel})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {selectedService && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{selectedService.name}</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">{formatCurrency(selectedService.amount)}</span>
                </div>
                <p className="text-slate-600">{selectedService.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-emerald-800 pt-1">
                  <span>Court: <strong>{selectedService.courtType}</strong></span>
                  <span>•</span>
                  <span>Model: <strong>{selectedService.feeModel}</strong></span>
                </div>

                {isVariable && (
                  <div className="pt-3 border-t border-slate-200 mt-2 space-y-1">
                    <label className="block text-slate-700 font-semibold">
                      Enter Quantity / Copy Count ({selectedService.unitLabel}):
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Payer Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <User className="w-4 h-4 text-amber-700" />
              2. Payer Identification Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Full Payer Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. payer@example.com"
                    value={payerEmail}
                    onChange={(e) => setPayerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08031234567"
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Dynamic Conditional Fields based on Selected Service */}
          {selectedService && selectedService.requiredFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <FileText className="w-4 h-4 text-amber-700" />
                3. Service Specific Case & Legal Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {selectedService.requiredFields.map(reqKey => {
                  const config = DYNAMIC_FIELD_CONFIGS[reqKey];
                  if (!config) return null;
                  return (
                    <div key={reqKey}>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        {config.label} {config.required ? '*' : '(Optional)'}
                      </label>
                      <input
                        type="text"
                        placeholder={config.placeholder}
                        value={fieldData[reqKey] || ''}
                        onChange={(e) => handleFieldChange(reqKey, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Total Amount to Pay</span>
              <span className="text-2xl font-extrabold font-mono text-amber-700">
                {formatCurrency(totalPayable)}
              </span>
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 transition-all"
            >
              Review Payment Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* STEP 2: Review Payment Details */}
      {step === 2 && selectedService && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6 shadow-md">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Review Payment Information</h3>
            <p className="text-xs text-slate-600">Please confirm your payment details before generating unique reference.</p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-500 block">Payer Name:</span>
                <span className="font-bold text-slate-900 text-sm">{payerName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Payer Contact:</span>
                <span className="font-semibold text-slate-700">{payerEmail} | {payerPhone}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Judiciary Service:</span>
                <span className="font-bold text-amber-700">{selectedService.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Court / Jurisdiction:</span>
                <span className="font-semibold text-emerald-800">{selectedService.courtType}</span>
              </div>
            </div>

            {/* Dynamic fields review */}
            {Object.keys(fieldData).length > 0 && (
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Case / Filing Information:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                  {Object.entries(fieldData).map(([k, v]) => (
                    <div key={k}>
                      <span className="text-slate-500 capitalize">{k.replace(/_/g, ' ')}: </span>
                      <span className="font-semibold text-slate-900">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fee calculation breakdown */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase text-amber-700 font-bold block">Total Amount Payable</span>
                <span className="text-[10px] text-slate-500">Base Rate: {formatCurrency(unitPrice)} {isVariable ? `x ${quantity} copies` : ''}</span>
              </div>
              <span className="text-3xl font-extrabold font-mono text-amber-700">
                {formatCurrency(totalPayable)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Edit Details
            </button>

            <button
              onClick={handleGenerateReference}
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all"
            >
              {loading ? 'Generating Reference...' : 'Generate Reference & Pay'}
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Reference Generated & Gateway Launch */}
      {step === 3 && generatedPayment && (
        <div className="bg-white rounded-3xl border border-emerald-600/60 p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-600 text-emerald-800 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold uppercase">
              Reference Successfully Generated
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Ready For Online Payment
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your unique payment reference has been registered with WTC Kaduna State Judiciary Revenue System.
            </p>
          </div>

          {/* Reference Display Box showing separate identifiers */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-lg mx-auto space-y-4 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">
                Unique Payment Reference
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono text-amber-700 tracking-wider">
                {generatedPayment.paymentReference}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-left">
              <div>
                <span className="text-[10px] text-slate-500 block">Internal Txn ID:</span>
                <span className="font-mono font-bold text-slate-700">{generatedPayment.internalTxnId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Amount Payable:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">{formatCurrency(generatedPayment.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => router.push(`/gateway/${generatedPayment.paymentReference}`)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Secure Payment Gateway
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function PaymentInitiationPage() {
  return (
    <Suspense fallback={<PageSuspenseFallback />}>
      <PaymentInitiationPageContent />
    </Suspense>
  );
}
