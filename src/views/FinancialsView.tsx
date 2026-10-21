import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Booking, Cleaner, Language, UserSettings } from '../types';
import { getTranslation } from '../i18n/translations';
import { exportToCSV, downloadJSONBackup } from '../services/storage';

interface FinancialsViewProps {
  bookings: Booking[];
  cleaners: Cleaner[];
  settings: UserSettings;
  language: Language;
}

export const FinancialsView: React.FC<FinancialsViewProps> = ({
  bookings,
  cleaners,
  settings,
  language
}) => {
  const t = (key: string) => getTranslation(language, key);

  const totalGross = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((acc, b) => acc + b.totalAmount + b.tipAmount, 0);

  const totalCleanerShare = Math.round(totalGross * 0.65);
  const totalCompanyMargin = totalGross - totalCleanerShare;

  const handleExportCSV = () => {
    const headers = [
      'Booking ID',
      'Date',
      'Client Name',
      'Client Phone',
      'Service Title',
      'Assigned Cleaner',
      'Base Service (PHP)',
      'Tip (PHP)',
      'Total Amount (PHP)',
      'Cleaner Payout (65%)',
      'Company Margin (35%)',
      'Payment Method',
      'Status'
    ];

    const rows = bookings.map(b => {
      const payout = Math.round(b.totalAmount * 0.65) + b.tipAmount;
      const margin = b.totalAmount - Math.round(b.totalAmount * 0.65);
      return [
        b.id,
        b.scheduledDate,
        b.clientName,
        b.clientPhone,
        b.serviceTitle,
        b.cleanerName,
        b.totalAmount,
        b.tipAmount,
        b.totalAmount + b.tipAmount,
        payout,
        margin,
        b.paymentMethod || 'cash',
        b.paymentStatus
      ];
    });

    exportToCSV(`LinisPro_Financial_Report_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  const handleExportJSON = () => {
    downloadJSONBackup({
      exportTimestamp: new Date().toISOString(),
      merchant: settings.businessName,
      taxRate: settings.taxRatePercent,
      bookings,
      cleaners
    }, `LinisPro_Full_Database_Backup_${new Date().toISOString().split('T')[0]}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              {t('financialReportsTitle')}
            </h1>
            <span className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Biometric Secured
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit-ready transactions, staff commission payouts, and 12% EVAT reports.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t('exportCSV')}</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">{t('exportJSON')}</span>
            <span className="sm:hidden">Backup</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
            title={t('printStatement')}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-xs text-neutral-500 font-medium">Gross Collections</span>
          <div className="text-xl font-extrabold text-neutral-900 dark:text-white font-mono tabular-nums">
            ₱{totalGross.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400">Recorded bookings & tips</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">{t('commissionShare')}</span>
          <div className="text-xl font-extrabold text-teal-700 dark:text-teal-300 font-mono tabular-nums">
            ₱{totalCleanerShare.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400">Directly disbursed to cleaners</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-xs text-neutral-500 font-medium">{t('platformFee')}</span>
          <div className="text-xl font-extrabold text-neutral-700 dark:text-neutral-300 font-mono tabular-nums">
            ₱{totalCompanyMargin.toLocaleString()}
          </div>
          <span className="text-[11px] text-neutral-400">Retained operational margin</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            {t('financialLedger')}
          </h2>
          <span className="text-xs text-neutral-500 font-mono">
            {bookings.length} Records Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-4 font-semibold">{t('date')}</th>
                <th className="py-3 px-4 font-semibold">{t('bookingId')}</th>
                <th className="py-3 px-4 font-semibold">Client</th>
                <th className="py-3 px-4 font-semibold">{t('service')}</th>
                <th className="py-3 px-4 font-semibold">{t('cleaner')}</th>
                <th className="py-3 px-4 font-semibold text-right">{t('amount')}</th>
                <th className="py-3 px-4 font-semibold text-right">Staff Payout</th>
                <th className="py-3 px-4 font-semibold text-center">{t('status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {bookings.map((b) => {
                const payout = Math.round(b.totalAmount * 0.65) + b.tipAmount;
                return (
                  <tr key={b.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {b.scheduledDate}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-white whitespace-nowrap">
                      #{b.id}
                    </td>
                    <td className="py-3 px-4 font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                      {b.clientName}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 truncate max-w-[160px]">
                      {b.serviceTitle}
                    </td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {b.cleanerName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-neutral-900 dark:text-white tabular-nums whitespace-nowrap">
                      ₱{b.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-teal-600 dark:text-teal-400 tabular-nums whitespace-nowrap">
                      ₱{payout.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                        b.paymentStatus === 'paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                      }`}>
                        {b.paymentStatus.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
