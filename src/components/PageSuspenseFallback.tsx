import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function PageSuspenseFallback() {
  return (
    <div className="max-w-md mx-auto py-24 text-center space-y-4">
      <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
      <p className="text-slate-400 text-sm">Loading official Judiciary revenue module...</p>
    </div>
  );
}
