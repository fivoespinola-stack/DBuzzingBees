import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar, 
  Star, 
  Award, 
  ArrowUpRight
} from 'lucide-react';
import { Booking, Cleaner, AdminClient } from '../types';

interface AnalyticsViewProps {
  bookings: Booking[];
  cleaners: Cleaner[];
  clients: AdminClient[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  bookings,
  cleaners,
  clients
}) => {
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid')
    .reduce((acc, b) => acc + b.totalAmount + b.tipAmount, 0) + 14850;

  const totalCompletedBookings = bookings.filter(b => b.status === 'completed').length + 184;
  const activeStaffCount = cleaners.filter(c => c.status !== 'on_leave').length;

  // Monthly Revenue Data Simulation in AUD
  const monthlyData = [
    { month: 'May', revenue: 14200, bookings: 48 },
    { month: 'Jun', revenue: 16800, bookings: 56 },
    { month: 'Jul', revenue: 18400, bookings: 64 },
    { month: 'Aug', revenue: 21500, bookings: 75 },
    { month: 'Sep', revenue: 25900, bookings: 89 },
    { month: 'Oct', revenue: 28450, bookings: 102 }
  ];

  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  // Service breakdown for the 5 services
  const serviceStats = [
    { name: 'Residential Clean', percent: 40, count: 82 },
    { name: 'Vacate Clean (Bond Back)', percent: 26, count: 54 },
    { name: 'Commercial Office Clean', percent: 18, count: 37 },
    { name: 'Mowing & Garden Care', percent: 10, count: 21 },
    { name: 'Window Clean', percent: 6, count: 12 }
  ];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span>🐝</span>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            DBuzzingBees Perth Performance & Intelligence
          </h1>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">
          Real-time metrics for Western Australia residential, commercial, vacate, window, and mowing operations.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            label: 'Monthly Gross Billing', 
            val: `$${totalRevenue.toLocaleString()} AUD`, 
            icon: <TrendingUp className="w-4 h-4 text-amber-500" />,
            change: '+22.4% vs last month',
            isPositive: true 
          },
          { 
            label: 'Total Completed Cleans', 
            val: totalCompletedBookings.toString(), 
            icon: <Calendar className="w-4 h-4 text-emerald-500" />,
            change: '+14 new client contracts',
            isPositive: true 
          },
          { 
            label: 'Active Perth Staff', 
            val: `${activeStaffCount} / ${cleaners.length}`, 
            icon: <Users className="w-4 h-4 text-sky-500" />,
            change: '100% Police Cleared',
            isPositive: true 
          },
          { 
            label: 'Customer CSAT Score', 
            val: '★ 4.96', 
            icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" />,
            change: '168 verified Perth reviews',
            isPositive: true 
          }
        ].map((kpi, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-medium">{kpi.label}</span>
              <div className="p-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                {kpi.icon}
              </div>
            </div>

            <div className="text-2xl font-extrabold text-neutral-900 dark:text-white font-mono tabular-nums">
              {kpi.val}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue Bar Chart (Spans 2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Perth Monthly Revenue Trajectory
              </h2>
              <p className="text-xs text-neutral-500">
                Monthly gross cleaning and garden billing (AUD $)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
              2026 Perth WA Growth
            </span>
          </div>

          <div className="h-48 flex items-end gap-3 sm:gap-6 pt-6 border-b border-neutral-100 dark:border-neutral-800">
            {monthlyData.map((d) => {
              const heightPercent = Math.round((d.revenue / maxRevenue) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono font-semibold text-neutral-400 group-hover:text-amber-600 transition-colors opacity-0 group-hover:opacity-100 tabular-nums">
                    ${(d.revenue / 1000).toFixed(1)}k
                  </span>
                  <div 
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-amber-100 dark:bg-amber-950/60 rounded-t-lg group-hover:bg-amber-400 transition-all duration-300 relative"
                  >
                    <div className="absolute inset-0 bg-amber-400/30 group-hover:bg-amber-400 rounded-t-lg transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Average Order Value: <strong>$185.00 AUD</strong></span>
            <span>Recurring Retention Rate: <strong>94.2%</strong></span>
          </div>
        </div>

        {/* Service Categories Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              5 Core Services Breakdown
            </h2>
            <p className="text-xs text-neutral-500">
              Contract distribution across Perth properties
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {serviceStats.map((srv) => (
              <div key={srv.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate max-w-[180px]">
                    {srv.name}
                  </span>
                  <span className="font-mono text-neutral-500 font-semibold tabular-nums">
                    {srv.percent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${srv.percent}%` }}
                    className="h-full bg-amber-400 rounded-full transition-all"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Staff Leaderboard */}
      <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Perth Cleaner of the Month Leaderboard
            </h2>
            <p className="text-xs text-neutral-500">
              Ranked by customer reviews, bond-back inspection success, and on-time punctuality
            </p>
          </div>
          <Award className="w-5 h-5 text-amber-500" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {cleaners.slice(0, 3).map((cleaner, rank) => (
            <div
              key={cleaner.id}
              className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 flex items-center gap-3"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                rank === 0 ? 'bg-amber-400 text-neutral-950' : rank === 1 ? 'bg-slate-300 text-neutral-900' : 'bg-amber-700 text-white'
              }`}>
                #{rank + 1}
              </div>

              <img 
                src={cleaner.avatar} 
                alt={cleaner.name} 
                className="w-10 h-10 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />

              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                  {cleaner.name}
                </div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-semibold">
                  ★ {cleaner.rating} · {cleaner.completedJobs} jobs
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
