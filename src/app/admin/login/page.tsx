'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StaffRecord } from '@/lib/types';
import { Scale, ShieldCheck, Lock, User, Key, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';

const PRESET_DEMO_ACCOUNTS = [
  {
    roleTitle: 'Judiciary Revenue Officer',
    email: 'officer@judiciary.kd.gov.ng',
    password: 'password123',
    name: 'Amina Yusuf',
    court: 'High Court Division 1 Kaduna',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    roleTitle: 'Judiciary Auditor',
    email: 'auditor@judiciary.kd.gov.ng',
    password: 'password123',
    name: 'Hon. Justice Ibrahim Bello',
    court: 'Kaduna Judicial Headquarters',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    roleTitle: 'WTC Technical Admin',
    email: 'admin@wtc.ng',
    password: 'password123',
    name: 'Engr. David Okafor',
    court: 'WTC Technology Operations Hub',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
  }
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [allDemoAccounts, setAllDemoAccounts] = useState(PRESET_DEMO_ACCOUNTS);

  useEffect(() => {
    // Load any cached personnel added by user in demo
    if (typeof window !== 'undefined') {
      const cachedStaffStr = localStorage.getItem('wtc_demo_staff_list');
      if (cachedStaffStr) {
        try {
          const cachedList: StaffRecord[] = JSON.parse(cachedStaffStr);
          const existingEmails = new Set(PRESET_DEMO_ACCOUNTS.map(a => a.email.toLowerCase()));

          const extraAccounts = cachedList
            .filter(stf => !existingEmails.has(stf.email.toLowerCase()))
            .map(stf => ({
              roleTitle: stf.role.replace(/_/g, ' '),
              email: stf.email,
              password: 'password123',
              name: stf.fullName,
              court: stf.courtDivision,
              badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
            }));

          setAllDemoAccounts([...PRESET_DEMO_ACCOUNTS, ...extraAccounts]);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processLogin(email, password);
  };

  const processLogin = (userEmail: string, userPass: string) => {
    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      let matched = allDemoAccounts.find(acc => acc.email.toLowerCase() === userEmail.toLowerCase());

      const sessionUser = matched ? {
        name: matched.name,
        email: matched.email,
        role: matched.roleTitle,
        court: matched.court,
      } : {
        name: userEmail.split('@')[0],
        email: userEmail,
        role: 'Judiciary Revenue Officer',
        court: 'Kaduna Judiciary Registry',
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('wtc_staff_session', JSON.stringify(sessionUser));
      }

      setLoading(false);
      router.push('/admin');
    }, 600);
  };

  const selectQuickAccount = (acc: typeof PRESET_DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    processLogin(acc.email, acc.password);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3 shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-400 mx-auto flex items-center justify-center shadow-md">
          <Scale className="w-6 h-6" />
        </div>

        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block">
            Official Personnel Authorization
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Kaduna Judiciary & WTC Staff Portal
          </h1>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
            Authorized sign-in for revenue officers, judiciary auditors, and WTC technical administrators.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-2xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Manual Login Form */}
      <form onSubmit={handleLoginSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-md">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2">
          Or Enter Staff Credentials
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Official Email Address
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="officer@judiciary.kd.gov.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Account Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
        >
          {loading ? 'Authenticating Session...' : 'Sign In to Staff Dashboard'}
          <Lock className="w-4 h-4 text-amber-400" />
        </button>

        <div className="text-[11px] text-slate-500 text-center pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 inline mr-1" />
          Protected session governed by Kaduna State Judiciary Revenue Governance Agreement.
        </div>
      </form>

    </div>
  );
}
