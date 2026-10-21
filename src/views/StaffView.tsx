import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  CheckCircle2, 
  Phone, 
  Plus, 
  ShieldCheck, 
  X
} from 'lucide-react';
import { Cleaner } from '../types';

interface StaffViewProps {
  cleaners: Cleaner[];
  onAddCleaner: (cleaner: Cleaner) => void;
  onUpdateCleanerStatus: (cleanerId: string, status: Cleaner['status']) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({
  cleaners,
  onAddCleaner,
  onUpdateCleanerStatus,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCleanerName, setNewCleanerName] = useState('');
  const [newCleanerRole, setNewCleanerRole] = useState('Residential Specialist');
  const [newCleanerPhone, setNewCleanerPhone] = useState('04');
  const [newCleanerSpecialty, setNewCleanerSpecialty] = useState('Vacate Cleans, Window Detailing');
  const [newCleanerHourly, setNewCleanerHourly] = useState(36);
  const [newCleanerBio, setNewCleanerBio] = useState('Experienced Perth housekeeper with valid WA Police Clearance.');

  const handleCreateCleaner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCleanerName.trim()) return;

    const newStaff: Cleaner = {
      id: `cleaner_${Date.now()}`,
      name: newCleanerName,
      role: newCleanerRole,
      avatar: '/src/assets/images/service_cleaner_avatar_1792590285414.jpg',
      phone: newCleanerPhone,
      rating: 5.0,
      completedJobs: 0,
      status: 'available',
      specialties: newCleanerSpecialty.split(',').map(s => s.trim()),
      hourlyRate: Number(newCleanerHourly),
      earnings: 0,
      bio: newCleanerBio,
      policeCheck: `WA Police Clear #WA-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    onAddCleaner(newStaff);
    setIsAddModalOpen(false);
    setNewCleanerName('');
  };

  const getStatusBadge = (status: Cleaner['status']) => {
    switch (status) {
      case 'available':
        return <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">Available / On Standby</span>;
      case 'on_duty':
        return <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">On Duty (In Field)</span>;
      case 'on_leave':
        return <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full">On Leave</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            DBuzzingBees Perth Staff & Roster
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Monitor cleaner availability, police clearances, completed Perth jobs, and wages.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Cleaner / Groundskeeper</span>
        </button>
      </div>

      {/* Staff Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cleaners.map((cleaner) => (
          <div
            key={cleaner.id}
            className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
          >
            {/* Profile Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img 
                  src={cleaner.avatar} 
                  alt={cleaner.name} 
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-amber-400/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {cleaner.name}
                  </h3>
                  <div className="text-xs text-neutral-500">
                    {cleaner.role}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono pt-0.5">
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {cleaner.rating}
                    </span>
                    <span>·</span>
                    <span className="text-neutral-500">
                      {cleaner.completedJobs} Perth jobs
                    </span>
                  </div>
                </div>
              </div>

              <div>
                {getStatusBadge(cleaner.status)}
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {cleaner.bio}
            </p>

            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{cleaner.policeCheck}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cleaner.specialties.map((spec, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Earnings and Wage */}
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div>
                <div className="text-[10px] text-neutral-400">Award Base Wage</div>
                <div className="font-bold font-mono text-neutral-900 dark:text-white tabular-nums">
                  ${cleaner.hourlyRate} / hr AUD
                </div>
              </div>

              <div>
                <div className="text-[10px] text-neutral-400">YTD Disbursed Earnings</div>
                <div className="font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
                  ${cleaner.earnings.toLocaleString()} AUD
                </div>
              </div>
            </div>

            {/* Cleaner Status Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <span className="text-neutral-500 flex items-center gap-1 font-mono text-[11px]">
                <Phone className="w-3 h-3 text-amber-500" />
                {cleaner.phone}
              </span>

              <div className="flex items-center gap-1">
                {(['available', 'on_duty', 'on_leave'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateCleanerStatus(cleaner.id, st)}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer capitalize ${
                      cleaner.status === st
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                        : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Add Specialist Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                Register New Perth Staff Member
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCleaner} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cameron Smith"
                  value={newCleanerName}
                  onChange={(e) => setNewCleanerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Role Title
                </label>
                <input
                  type="text"
                  required
                  value={newCleanerRole}
                  onChange={(e) => setNewCleanerRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Australian Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={newCleanerPhone}
                  onChange={(e) => setNewCleanerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Hourly Rate (AUD $)
                </label>
                <input
                  type="number"
                  required
                  value={newCleanerHourly}
                  onChange={(e) => setNewCleanerHourly(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Specialties (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCleanerSpecialty}
                  onChange={(e) => setNewCleanerSpecialty(e.target.value)}
                  placeholder="Vacate Clean, Mowing, Window Clean"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Bio & Experience
                </label>
                <textarea
                  rows={2}
                  value={newCleanerBio}
                  onChange={(e) => setNewCleanerBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold transition-all shadow-sm cursor-pointer"
              >
                Save Staff Profile
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
