import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'WTC Kaduna State Judiciary Revenue Collection System',
  description: 'Official online platform for paying Kaduna State Judiciary fees, generating references, downloading electronic receipts, and verifying payments.',
  keywords: ['Kaduna State Judiciary', 'WTC Nigeria Limited', 'Court Fees Kaduna', 'Probate Registry', 'Revenue Collection', 'Legal Fees Nigeria'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-amber-500 selection:text-slate-950">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
