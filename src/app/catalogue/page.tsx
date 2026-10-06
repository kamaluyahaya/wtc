'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JudiciaryService } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { BookOpen, Search, Filter, Calculator, ArrowRight, ShieldCheck, Scale, CheckCircle } from 'lucide-react';

export default function CataloguePage() {
  const [services, setServices] = useState<JudiciaryService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Fee Calculator Modal state
  const [calcService, setCalcService] = useState<JudiciaryService | null>(null);
  const [calcQty, setCalcQty] = useState<number>(1);
  const [calcAddOn, setCalcAddOn] = useState<number>(0);
  const [calcDiscount, setCalcDiscount] = useState<number>(0);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/services');
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
      }
    } catch (e) {
      console.error('Failed to fetch services', e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'ALL' || s.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.courtType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const calculateTotal = (service: JudiciaryService, qty: number, addOn: number, discount: number) => {
    const rate = service.amount;
    const baseTotal = service.feeModel === 'VARIABLE' ? rate * Math.max(1, qty) : rate;
    const total = baseTotal + Math.max(0, addOn) - Math.max(0, discount);
    return Math.max(0, total);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Scale className="w-3.5 h-3.5 text-amber-700" />
              Official Tariff Schedule
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Judiciary Revenue & Service Catalogue
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Approved tariff schedule for Kaduna State High Court, Magistrate, Probate, and Sharia Court divisions.
            </p>
          </div>

          <Link
            href="/pay"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 shrink-0 transition-all"
          >
            Initiate Fee Payment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by code, service, court..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm">Loading approved tariffs catalogue...</div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm space-y-2">
          <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
          <p>No revenue services match your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-600 transition-all hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono border border-slate-200">
                    {service.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    service.feeModel === 'VARIABLE' 
                      ? 'bg-purple-100 text-purple-800 border border-purple-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}>
                    {service.feeModel} FEE
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-wide">
                    {service.name}
                  </h3>
                  <span className="text-xs font-semibold text-amber-700 block mt-0.5">
                    {service.courtType}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Tariff Rate:</span>
                  <span className="font-mono font-extrabold text-slate-900 text-sm">
                    {formatCurrency(service.amount)}{' '}
                    {service.unitLabel && <span className="text-[10px] font-normal text-slate-500">({service.unitLabel})</span>}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setCalcService(service);
                    setCalcQty(1);
                    setCalcAddOn(0);
                    setCalcDiscount(0);
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5 text-amber-600" />
                  Calculate Tariff
                </button>

                <Link
                  href={`/pay?serviceId=${service.id}`}
                  className="py-2 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-colors flex items-center gap-1"
                >
                  Pay Fee
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interactive Tariff Calculator Modal */}
      {calcService && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl text-slate-900">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-700 font-bold uppercase">
                  <Calculator className="w-4 h-4" />
                  Server Tariff Calculator
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {calcService.name}
                </h3>
                <span className="text-xs text-slate-500">{calcService.courtType} ({calcService.code})</span>
              </div>
              <button
                onClick={() => setCalcService(null)}
                className="text-slate-400 hover:text-slate-700 p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Fee Formula Rule Demonstration */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Fee Model Type:</span>
                <span className="font-bold text-emerald-800 font-mono">{calcService.feeModel}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-600">Approved Base Rate:</span>
                <span className="font-bold font-mono text-slate-900">{formatCurrency(calcService.amount)}</span>
              </div>

              {calcService.feeModel === 'VARIABLE' && (
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">
                    Quantity / Number of Copies ({calcService.unitLabel}):
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={calcQty}
                    onChange={(e) => setCalcQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="text-slate-600 text-[11px] block font-medium">Additional Fee (₦):</label>
                  <input
                    type="number"
                    min="0"
                    value={calcAddOn}
                    onChange={(e) => setCalcAddOn(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 text-[11px] block font-medium">Approved Discount (₦):</label>
                  <input
                    type="number"
                    min="0"
                    value={calcDiscount}
                    onChange={(e) => setCalcDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <div>
                  <span className="text-[10px] uppercase text-amber-700 font-bold block">Calculated Total Payable</span>
                  <span className="text-[10px] text-slate-500">Tariff rule evaluated on server</span>
                </div>
                <span className="text-2xl font-extrabold font-mono text-amber-700">
                  {formatCurrency(calculateTotal(calcService, calcQty, calcAddOn, calcDiscount))}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCalcService(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close Calculator
              </button>
              <Link
                href={`/pay?serviceId=${calcService.id}&qty=${calcQty}`}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                Proceed to Pay <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
