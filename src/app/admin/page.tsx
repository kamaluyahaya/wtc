'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { JudiciaryService, AuditLog, SystemStats, StaffRecord, PaymentAttempt, ElectronicReceipt } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  LayoutDashboard,
  Scale,
  DollarSign,
  FileCheck,
  Activity,
  ShieldCheck,
  Plus,
  Radio,
  RefreshCw,
  Users,
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  LogOut,
  ExternalLink,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

export default function StaffAdminDashboardPage() {
  const router = useRouter();

  // Session state
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    court: string;
  } | null>(null);

  // Data states
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [services, setServices] = useState<JudiciaryService[]>([]);
  const [staffList, setStaffList] = useState<StaffRecord[]>([]);
  const [paymentList, setPaymentList] = useState<PaymentAttempt[]>([]);
  const [receiptsList, setReceiptsList] = useState<ElectronicReceipt[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Tab navigation: ANALYTICS | PAYMENTS | STAFF | VERIFY | TARIFFS | AUDIT
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'PAYMENTS' | 'STAFF' | 'VERIFY' | 'TARIFFS' | 'AUDIT'>('ANALYTICS');

  // Search & Filter states for Payments
  const [paymentFilterStatus, setPaymentFilterStatus] = useState<string>('ALL');
  const [paymentSearchQuery, setPaymentSearchQuery] = useState<string>('');

  // Verification tab query & state
  const [verifyRefQuery, setVerifyRefQuery] = useState('');
  const [verifyResultMsg, setVerifyResultMsg] = useState('');
  const [verifyProcessing, setVerifyProcessing] = useState(false);

  // New Tariff Modal state
  const [showTariffModal, setShowTariffModal] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<JudiciaryService>>({
    code: '',
    name: '',
    category: 'Court Fees',
    courtType: 'High Court Kaduna',
    feeModel: 'FIXED',
    amount: 10000,
    unitLabel: 'Flat Fee',
    description: '',
    requiredFields: ['suit_number', 'applicant_name'],
    status: 'ACTIVE',
  });

  // New Staff Modal state
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    email: '',
    role: 'JUDICIARY_REVENUE_OFFICER' as any,
    courtDivision: 'High Court Division 1 Kaduna',
    phone: '',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('wtc_staff_session');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentUser({
          name: 'Amina Yusuf',
          email: 'officer@judiciary.kd.gov.ng',
          role: 'Judiciary Revenue Officer',
          court: 'High Court Division 1 Kaduna',
        });
      }
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [auditRes, srvRes, staffRes, payRes] = await Promise.all([
        fetch('/api/admin/audit'),
        fetch('/api/services'),
        fetch('/api/admin/staff'),
        fetch('/api/admin/payments'),
      ]);

      const auditData = await auditRes.json();
      const srvData = await srvRes.json();
      const staffData = await staffRes.json();
      const payData = await payRes.json();

      if (auditData.success) {
        setAuditLogs(auditData.logs);
        setStats(auditData.stats);
      }
      if (srvData.success) {
        setServices(srvData.services);
      }
      if (staffData.success) {
        let combinedStaff = staffData.staff || [];
        if (typeof window !== 'undefined') {
          const cachedStaffStr = localStorage.getItem('wtc_demo_staff_list');
          if (cachedStaffStr) {
            try {
              const cachedList = JSON.parse(cachedStaffStr);
              const existingIds = new Set(combinedStaff.map((s: StaffRecord) => s.id));
              cachedList.forEach((stf: StaffRecord) => {
                if (!existingIds.has(stf.id)) {
                  combinedStaff.push(stf);
                  existingIds.add(stf.id);
                }
              });
            } catch (err) {
              console.error(err);
            }
          }
        }
        setStaffList(combinedStaff);
        setStats(prev => prev ? { ...prev, totalStaffCount: combinedStaff.length } : null);
      }
      if (payData.success) {
        setPaymentList(payData.payments);
        setReceiptsList(payData.receipts);
      }
    } catch (e) {
      console.error('Failed to load dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wtc_staff_session');
    }
    router.push('/admin/login');
  };

  const handleSaveTariff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowTariffModal(false);
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      fullName: staffForm.fullName || 'New Staff Officer',
      email: staffForm.email || `officer_${Date.now()}@judiciary.kd.gov.ng`,
      role: staffForm.role || 'JUDICIARY_REVENUE_OFFICER',
      courtDivision: staffForm.courtDivision || 'High Court Division 1 Kaduna',
      phone: staffForm.phone || '',
    };

    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      let newStaffRecord = data.success ? data.staff : null;
      if (!newStaffRecord) {
        newStaffRecord = {
          id: `STF-${Date.now().toString().slice(-4)}`,
          fullName: payload.fullName,
          email: payload.email,
          role: payload.role,
          courtDivision: payload.courtDivision,
          phone: payload.phone,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
        };
      }

      if (typeof window !== 'undefined') {
        const cachedStaffStr = localStorage.getItem('wtc_demo_staff_list');
        const currentCached: StaffRecord[] = cachedStaffStr ? JSON.parse(cachedStaffStr) : [];
        const updatedCached = [...currentCached, newStaffRecord];
        localStorage.setItem('wtc_demo_staff_list', JSON.stringify(updatedCached));
      }

      setShowStaffModal(false);
      setStaffForm({
        fullName: '',
        email: '',
        role: 'JUDICIARY_REVENUE_OFFICER',
        courtDivision: 'High Court Division 1 Kaduna',
        phone: '',
      });
      fetchDashboardData();
    } catch (e) {
      console.error(e);
      const fallbackRecord: StaffRecord = {
        id: `STF-${Date.now().toString().slice(-4)}`,
        fullName: payload.fullName,
        email: payload.email,
        role: payload.role,
        courtDivision: payload.courtDivision,
        phone: payload.phone,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        const cachedStaffStr = localStorage.getItem('wtc_demo_staff_list');
        const currentCached: StaffRecord[] = cachedStaffStr ? JSON.parse(cachedStaffStr) : [];
        const updatedCached = [...currentCached, fallbackRecord];
        localStorage.setItem('wtc_demo_staff_list', JSON.stringify(updatedCached));
      }

      setShowStaffModal(false);
      fetchDashboardData();
    }
  };

  const handleManualWebhookVerify = async (ref: string) => {
    if (!ref.trim()) return;
    setVerifyProcessing(true);
    setVerifyResultMsg('');

    try {
      const res = await fetch('/api/webhooks/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentReference: ref.trim(),
          gatewayTransactionId: `GW-STAFF-VERIFY-${Date.now()}`,
          status: 'PAID',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setVerifyResultMsg(`Success! Verified payment ${ref} and issued receipt ${data.receipt.receiptNo}`);
        fetchDashboardData();
      } else {
        setVerifyResultMsg(`Error: ${data.message}`);
      }
    } catch (e: any) {
      setVerifyResultMsg('Webhook trigger failed.');
    } finally {
      setVerifyProcessing(false);
    }
  };

  const filteredPayments = paymentList.filter(p => {
    const matchesStatus = paymentFilterStatus === 'ALL' || p.status === paymentFilterStatus;
    const matchesSearch =
      p.paymentReference.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
      p.payerName.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
      p.serviceName.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
      p.internalTxnId.toLowerCase().includes(paymentSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Dashboard Top Session Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                Staff Portal
              </span>
              {currentUser && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {currentUser.role}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Kaduna Judiciary Revenue Dashboard
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Logged in as <strong>{currentUser?.name || 'Authorized Staff'}</strong> ({currentUser?.email}) • {currentUser?.court}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sync
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="pt-6 flex flex-wrap gap-2 border-t border-slate-200 mt-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'ANALYTICS' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Analytics Overview
          </button>

          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'PAYMENTS' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Payment Records ({paymentList.length})
          </button>

          <button
            onClick={() => setActiveTab('STAFF')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'STAFF' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
          >
            <Users className="w-3.5 h-3.5" /> Staff Roster ({staffList.length})
          </button>

          <button
            onClick={() => setActiveTab('VERIFY')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'VERIFY' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
          >
            <FileCheck className="w-3.5 h-3.5" /> Manual Payment Verification
          </button>

          <button
            onClick={() => setActiveTab('TARIFFS')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'TARIFFS' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
          >
            <Scale className="w-3.5 h-3.5" /> Tariff Schedule
          </button>

          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'AUDIT' ? 'bg-amber-500 text-slate-950 font-bold shadow-xs' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
          >
            <Activity className="w-3.5 h-3.5" /> Audit Logs
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS OVERVIEW */}
      {activeTab === 'ANALYTICS' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Total Verified Revenue</span>
              <div className="text-2xl font-black font-mono text-emerald-800">
                {formatCurrency(stats?.totalRevenue || 0)}
              </div>
              <span className="text-[11px] text-slate-500">Collected & Webhook Verified</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Payment References</span>
              <div className="text-2xl font-black font-mono text-amber-700">
                {stats?.totalTransactions || 0}
              </div>
              <span className="text-[11px] text-slate-500">Generated Payment References</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Verified Receipts</span>
              <div className="text-2xl font-black font-mono text-blue-700">
                {stats?.verifiedReceiptsCount || 0}
              </div>
              <span className="text-[11px] text-slate-500">Issued Official Receipts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Active Tariffs</span>
              <div className="text-2xl font-black font-mono text-purple-700">
                {stats?.activeServicesCount || 0}
              </div>
              <span className="text-[11px] text-slate-500">Judiciary Approved Services</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Authorized Staff</span>
              <div className="text-2xl font-black font-mono text-slate-900">
                {staffList.length}
              </div>
              <span className="text-[11px] text-slate-500">Active Personnel Records</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-700" />
                Recent Payment Attempts
              </h3>
              <div className="space-y-2 text-xs">
                {paymentList.slice(0, 4).map(p => (
                  <div key={p.paymentReference} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-amber-700 block">{p.paymentReference}</span>
                      <span className="font-semibold text-slate-900">{p.payerName} ({p.serviceName})</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 block">{formatCurrency(p.totalAmount)}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                        }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Scale className="w-5 h-5 text-emerald-800" />
                Institutional SLA Roles
              </h3>
              <div className="space-y-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-emerald-900 block">Kaduna State Judiciary Authority</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">Statutory Revenue Authority, Revenue heads approval, Official Receipt issuing authority, Financial records owner.</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-amber-800 block">WTC Nigeria Limited Operational Role</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">Software Provider, Platform hosting, webhook payment engine, SSL encryption, 24/7 technical support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENT RECORDS */}
      {activeTab === 'PAYMENTS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">All Judiciary Payment Records</h3>
              <p className="text-xs text-slate-500">Searchable list of all payment references, internal transaction IDs, and receipt numbers.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <select
                value={paymentFilterStatus}
                onChange={(e) => setPaymentFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">PAID Only</option>
                <option value="PENDING">PENDING Only</option>
                <option value="FAILED">FAILED Only</option>
              </select>

              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search payer, ref, service..."
                  value={paymentSearchQuery}
                  onChange={(e) => setPaymentSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Payment Ref</th>
                  <th className="p-3">Internal Txn ID</th>
                  <th className="p-3">Payer Name</th>
                  <th className="p-3">Judiciary Service</th>
                  <th className="p-3">Court / Station</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredPayments.map(p => (
                  <tr key={p.paymentReference} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-amber-700">{p.paymentReference}</td>
                    <td className="p-3 font-mono text-slate-500">{p.internalTxnId}</td>
                    <td className="p-3 font-bold text-slate-900">{p.payerName}</td>
                    <td className="p-3 text-slate-700">{p.serviceName}</td>
                    <td className="p-3 text-emerald-800 font-semibold">{p.courtDivision}</td>
                    <td className="p-3 font-mono font-bold">{formatCurrency(p.totalAmount)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-700">
                      {p.receiptNo || '—'}
                    </td>
                    <td className="p-3">
                      {p.status === 'PAID' ? (
                        <Link
                          href={`/receipt/${p.paymentReference}`}
                          className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded text-[10px] flex items-center gap-1"
                        >
                          Receipt <ExternalLink className="w-3 h-3" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleManualWebhookVerify(p.paymentReference)}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[10px]"
                        >
                          Verify Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STAFF ROSTER */}
      {activeTab === 'STAFF' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Authorized Personnel & Staff Roster</h3>
              <p className="text-xs text-slate-500">Registry of Kaduna State Judiciary Revenue Officers, Auditors, and WTC Technical Staff.</p>
            </div>
            <button
              onClick={() => setShowStaffModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <UserPlus className="w-4 h-4" /> Add Personnel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Staff ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Official Email</th>
                  <th className="p-3">Assigned Role</th>
                  <th className="p-3">Court Station / Division</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {staffList.map(stf => (
                  <tr key={stf.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-amber-700">{stf.id}</td>
                    <td className="p-3 font-bold text-slate-900">{stf.fullName}</td>
                    <td className="p-3 font-mono text-slate-600">{stf.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700">
                        {stf.role}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-emerald-800">{stf.courtDivision}</td>
                    <td className="p-3 font-mono text-slate-600">{stf.phone || '—'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {stf.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MANUAL PAYMENT VERIFICATION */}
      {activeTab === 'VERIFY' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 max-w-2xl mx-auto shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase">
              <Radio className="w-4 h-4" /> Manual Webhook & Gateway Override Tool
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Manual Payment Confirmation & Webhook Trigger
            </h3>
            <p className="text-xs text-slate-500">
              For authorized revenue officers and auditors to manually verify payment signals and issue official receipts.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Enter Payment Reference (e.g. KJ202610068F4A72):
              </label>
              <input
                type="text"
                value={verifyRefQuery}
                onChange={(e) => setVerifyRefQuery(e.target.value)}
                placeholder="KJ2026..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono text-sm"
              />
            </div>

            <button
              onClick={() => handleManualWebhookVerify(verifyRefQuery)}
              disabled={verifyProcessing}
              className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              {verifyProcessing ? 'Triggering Webhook...' : 'Fire Gateway Webhook & Issue Receipt'}
            </button>

            {verifyResultMsg && (
              <div className="p-4 bg-slate-50 rounded-xl border border-emerald-300 text-emerald-900 font-mono text-xs">
                {verifyResultMsg}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: TARIFF CONFIGURATION */}
      {activeTab === 'TARIFFS' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Judiciary Approved Revenue Heads & Tariffs</h3>
              <p className="text-xs text-slate-500">Configure rates, fee models (Fixed / Variable), and dynamic required fields.</p>
            </div>
            <button
              onClick={() => setShowTariffModal(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Tariff
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Service Name</th>
                  <th className="p-3">Court / Jurisdiction</th>
                  <th className="p-3">Fee Model</th>
                  <th className="p-3">Rate / Amount</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-amber-700">{s.code}</td>
                    <td className="p-3 font-bold text-slate-900">{s.name}</td>
                    <td className="p-3 text-emerald-800 font-semibold">{s.courtType}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 font-mono text-slate-700">
                        {s.feeModel}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold">{formatCurrency(s.amount)}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT LOGS */}
      {activeTab === 'AUDIT' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-bold text-slate-900">System Audit & Compliance Log</h3>
            <p className="text-xs text-slate-500">Immutable record of payments, webhook verifications, and tariff modifications.</p>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {auditLogs.map(log => (
              <div key={log.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-700 font-mono text-[11px]">{log.action}</span>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-medium">{log.actor}</span>
                  </div>
                  <span className="text-slate-500 text-[10px]">{formatDate(log.timestamp)}</span>
                </div>
                <p className="text-slate-800">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Adding New Tariff */}
      {showTariffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 text-slate-900 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add New Judiciary Revenue Head</h3>

            <form onSubmit={handleSaveTariff} className="space-y-3">
              <div>
                <label className="block font-semibold">Service Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KJ-HC-009"
                  value={serviceForm.code}
                  onChange={e => setServiceForm({ ...serviceForm, code: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Decree Nisi Certification"
                  value={serviceForm.name}
                  onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold">Category</label>
                  <input
                    type="text"
                    value={serviceForm.category}
                    onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Fee Model</label>
                  <select
                    value={serviceForm.feeModel}
                    onChange={e => setServiceForm({ ...serviceForm, feeModel: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="FIXED">FIXED</option>
                    <option value="VARIABLE">VARIABLE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold">Base Amount (₦) *</label>
                <input
                  type="number"
                  required
                  value={serviceForm.amount}
                  onChange={e => setServiceForm({ ...serviceForm, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTariffModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Tariff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Adding New Staff */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 text-slate-900 text-xs shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add New Personnel Record</h3>

            <form onSubmit={handleSaveStaff} className="space-y-3">
              <div>
                <label className="block font-semibold">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maryam Danjuma"
                  value={staffForm.fullName}
                  onChange={e => setStaffForm({ ...staffForm, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="maryam@judiciary.kd.gov.ng"
                  value={staffForm.email}
                  onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold">Role Title</label>
                  <select
                    value={staffForm.role}
                    onChange={e => setStaffForm({ ...staffForm, role: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  >
                    <option value="JUDICIARY_REVENUE_OFFICER">Revenue Officer</option>
                    <option value="JUDICIARY_AUDITOR">Judiciary Auditor</option>
                    <option value="WTC_TECH_ADMIN">WTC Tech Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="0803..."
                    value={staffForm.phone}
                    onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold">Assigned Court Division / Station *</label>
                <input
                  type="text"
                  required
                  placeholder="High Court Division 1 Kaduna"
                  value={staffForm.courtDivision}
                  onChange={e => setStaffForm({ ...staffForm, courtDivision: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Create Staff Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
