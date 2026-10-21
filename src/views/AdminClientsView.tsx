import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  FileSpreadsheet, 
  Printer, 
  Clock, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Filter, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  Sparkles, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { AdminClient, CleanType, FrequencyType, DayOfWeek, Cleaner } from '../types';
import { exportToCSV } from '../services/storage';

interface AdminClientsViewProps {
  clients: AdminClient[];
  cleaners: Cleaner[];
  onAddClient: (client: AdminClient) => void;
  onUpdateClient: (client: AdminClient) => void;
  onDeleteClient: (clientId: string) => void;
  onLogoutAdmin: () => void;
}

export const AdminClientsView: React.FC<AdminClientsViewProps> = ({
  clients,
  cleaners,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onLogoutAdmin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cleanTypeFilter, setCleanTypeFilter] = useState<string>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('all');
  
  // Modal states
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<AdminClient | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('04');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCleanType, setFormCleanType] = useState<CleanType>('residential');
  const [formRate, setFormRate] = useState<number>(55);
  const [formRateType, setFormRateType] = useState<'hourly' | 'flat'>('hourly');
  const [formFrequency, setFormFrequency] = useState<FrequencyType>('fortnightly');
  const [formHours, setFormHours] = useState<number>(3.0);
  const [formDay, setFormDay] = useState<DayOfWeek>('Tuesday');
  const [formDate, setFormDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [formCleaner, setFormCleaner] = useState<string>(cleaners[0]?.name || 'Sarah Davies');
  const [formRemarks, setFormRemarks] = useState('');
  const [formStatus, setFormStatus] = useState<'active' | 'completed' | 'paused'>('active');

  const cleanTypeLabels: Record<CleanType, string> = {
    residential: 'Residential',
    commercial: 'Commercial',
    vacate: 'Vacate Clean',
    window: 'Window Clean',
    mowing: 'Mowing & Garden Care'
  };

  const frequencyLabels: Record<FrequencyType, string> = {
    weekly: 'Weekly',
    fortnightly: 'Fortnightly',
    monthly: 'Monthly',
    end_of_month: 'End of the month',
    twice_a_week: 'Twice a week',
    every_3rd_week: 'Every 3rd week',
    every_2_months: 'Every 2 months',
    flexible: 'Flexible',
    once: 'Once (One-off)'
  };

  const dayOptions: DayOfWeek[] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Flexible'
  ];

  const handleOpenAdd = () => {
    setEditingClient(null);
    setFormName('');
    setFormPhone('04');
    setFormEmail('');
    setFormAddress('Perth WA');
    setFormCleanType('residential');
    setFormRate(55);
    setFormRateType('hourly');
    setFormFrequency('fortnightly');
    setFormHours(3.0);
    setFormDay('Tuesday');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCleaner(cleaners[0]?.name || 'Sarah Davies');
    setFormRemarks('');
    setFormStatus('active');
    setIsClientModalOpen(true);
  };

  const handleOpenEdit = (client: AdminClient) => {
    setEditingClient(client);
    setFormName(client.clientName);
    setFormPhone(client.phone);
    setFormEmail(client.email);
    setFormAddress(client.address);
    setFormCleanType(client.cleanType);
    setFormRate(client.rate);
    setFormRateType(client.rateType);
    setFormFrequency(client.frequency);
    setFormHours(client.hours);
    setFormDay(client.scheduledDay);
    setFormDate(client.scheduledDate);
    setFormCleaner(client.cleanerAssigned);
    setFormRemarks(client.remarks);
    setFormStatus(client.status);
    setIsClientModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingClient) {
      const updated: AdminClient = {
        ...editingClient,
        clientName: formName,
        phone: formPhone,
        email: formEmail,
        address: formAddress,
        cleanType: formCleanType,
        rate: Number(formRate),
        rateType: formRateType,
        frequency: formFrequency,
        hours: Number(formHours),
        scheduledDay: formDay,
        scheduledDate: formDate,
        cleanerAssigned: formCleaner,
        remarks: formRemarks,
        status: formStatus
      };
      onUpdateClient(updated);
    } else {
      const newClient: AdminClient = {
        id: `CL-${Math.floor(100 + Math.random() * 900)}`,
        clientName: formName,
        phone: formPhone,
        email: formEmail,
        address: formAddress,
        cleanType: formCleanType,
        rate: Number(formRate),
        rateType: formRateType,
        frequency: formFrequency,
        hours: Number(formHours),
        scheduledDay: formDay,
        scheduledDate: formDate,
        cleanerAssigned: formCleaner,
        remarks: formRemarks,
        status: formStatus,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onAddClient(newClient);
    }

    setIsClientModalOpen(false);
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = 
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cleanerAssigned.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.remarks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (cleanTypeFilter !== 'all' && c.cleanType !== cleanTypeFilter) return false;
    if (frequencyFilter !== 'all' && c.frequency !== frequencyFilter) return false;
    return true;
  });

  const handleExportCSV = () => {
    const headers = [
      'Client ID',
      'Client Name',
      'Phone',
      'Email',
      'Address (Perth WA)',
      'Clean Type',
      'Rate (AUD)',
      'Rate Structure',
      'Frequency Type',
      'Hours to Clean',
      'Scheduled Day',
      'Scheduled Date',
      'Assigned Cleaner',
      'Remarks',
      'Status'
    ];

    const rows = filteredClients.map(c => [
      c.id,
      c.clientName,
      c.phone,
      c.email,
      c.address,
      cleanTypeLabels[c.cleanType],
      `$${c.rate}`,
      c.rateType === 'hourly' ? 'Per Hour' : 'Flat Rate',
      frequencyLabels[c.frequency],
      `${c.hours} hrs`,
      c.scheduledDay,
      c.scheduledDate,
      c.cleanerAssigned,
      c.remarks,
      c.status
    ]);

    exportToCSV(`DBuzzingBees_Perth_Clients_${new Date().toISOString().split('T')[0]}`, headers, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-neutral-900 dark:text-white">
              DBuzzingBees Client Master Roster
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Perth WA Admin
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Active service agreements, rates, frequencies, clean duration, scheduled days & staff allocations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
            title="Print Client Roster"
          >
            <Printer className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Client</span>
          </button>

          <button
            type="button"
            onClick={onLogoutAdmin}
            className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search client name, Perth address, cleaner, or remarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-amber-500"
          />
        </div>

        {/* Clean Type Selector */}
        <div>
          <select
            value={cleanTypeFilter}
            onChange={(e) => setCleanTypeFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-amber-500"
          >
            <option value="all">All Clean Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="vacate">Vacate Clean</option>
            <option value="window">Window Clean</option>
            <option value="mowing">Mowing & Garden</option>
          </select>
        </div>

        {/* Frequency Selector */}
        <div>
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white focus:outline-amber-500"
          >
            <option value="all">All Frequencies</option>
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="monthly">Monthly</option>
            <option value="end_of_month">End of the month</option>
            <option value="twice_a_week">Twice a week</option>
            <option value="every_3rd_week">Every 3rd week</option>
            <option value="every_2_months">Every 2 months</option>
            <option value="flexible">Flexible</option>
            <option value="once">Once</option>
          </select>
        </div>
      </div>

      {/* Roster Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-neutral-500 text-[11px]">Total Active Clients</span>
          <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
            {clients.filter(c => c.status === 'active').length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-neutral-500 text-[11px]">Weekly Cleaning Hours</span>
          <div className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
            {clients.reduce((acc, c) => acc + (c.status === 'active' ? c.hours : 0), 0)} hrs/wk
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-neutral-500 text-[11px]">Vacate Cleans Booked</span>
          <div className="text-lg font-bold font-mono text-neutral-900 dark:text-white">
            {clients.filter(c => c.cleanType === 'vacate').length}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <span className="text-neutral-500 text-[11px]">Mowing Runs</span>
          <div className="text-lg font-bold font-mono text-emerald-600">
            {clients.filter(c => c.cleanType === 'mowing').length}
          </div>
        </div>
      </div>

      {/* Main Admin Clients Table */}
      <div className="rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              Perth Client Database ({filteredClients.length} clients listed)
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap">Client & Contact</th>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap">Perth WA Address</th>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap">Clean Type</th>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap text-right">Rate (AUD)</th>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap">Frequency</th>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap text-center">Duration</th>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap">Day & Next Date</th>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap">Assigned Cleaner</th>
                <th className="py-3 px-3.5 font-semibold whitespace-nowrap">Remarks</th>
                <th className="py-3 px-3.5 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  
                  {/* Client Name & ID */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="font-bold text-neutral-900 dark:text-white">
                      {client.clientName}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-mono">
                      {client.phone}
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-3 px-3.5 max-w-[200px]">
                    <div className="text-neutral-800 dark:text-neutral-200 font-medium truncate" title={client.address}>
                      {client.address}
                    </div>
                  </td>

                  {/* Clean Type */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="font-semibold text-neutral-900 dark:text-white px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800">
                      {cleanTypeLabels[client.cleanType]}
                    </span>
                  </td>

                  {/* Rate */}
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-neutral-900 dark:text-white tabular-nums whitespace-nowrap">
                    ${client.rate} {client.rateType === 'hourly' ? '/hr' : 'flat'}
                  </td>

                  {/* Frequency Type */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                      {frequencyLabels[client.frequency]}
                    </span>
                  </td>

                  {/* Duration / Hours */}
                  <td className="py-3 px-3.5 text-center font-mono font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                    {client.hours} hrs
                  </td>

                  {/* Scheduled Day & Date */}
                  <td className="py-3 px-3.5 whitespace-nowrap font-mono">
                    <div className="font-sans font-medium text-neutral-900 dark:text-white">
                      {client.scheduledDay}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {client.scheduledDate}
                    </div>
                  </td>

                  {/* Cleaner Assigned */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <span className="font-medium text-teal-700 dark:text-teal-300">
                      {client.cleanerAssigned}
                    </span>
                  </td>

                  {/* Remarks */}
                  <td className="py-3 px-3.5 max-w-[220px]">
                    <p className="text-[11px] text-neutral-500 italic truncate" title={client.remarks}>
                      "{client.remarks || 'None'}"
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(client)}
                        className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                        title="Edit Client"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete client record for ${client.clientName}?`)) {
                            onDeleteClient(client.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Client Modal */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
              <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                {editingClient ? 'Edit DBuzzingBees Client Agreement' : 'Add New Perth Client Agreement'}
              </h2>
              <button 
                onClick={() => setIsClientModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Row 1: Client Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Client Full Name / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Charlotte Henderson or Subiaco Legal"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Phone Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="0412 884 192"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono focus:outline-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Email & Perth Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="charlotte@westnet.com.au"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Address (Perth Suburb / WA Postcode) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="e.g. 42 Marine Parade, Cottesloe WA 6011"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                  />
                </div>
              </div>

              {/* Row 3: Clean Type & Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Clean Type *
                  </label>
                  <select
                    value={formCleanType}
                    onChange={(e) => setFormCleanType(e.target.value as CleanType)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="vacate">Vacate Clean</option>
                    <option value="window">Window Clean</option>
                    <option value="mowing">Mowing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Rate (AUD $) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formRate}
                    onChange={(e) => setFormRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Rate Structure
                  </label>
                  <select
                    value={formRateType}
                    onChange={(e) => setFormRateType(e.target.value as 'hourly' | 'flat')}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                  >
                    <option value="hourly">Per Hour ($/hr)</option>
                    <option value="flat">Flat Rate</option>
                  </select>
                </div>
              </div>

              {/* Row 4: Frequency Type & Hours Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Frequency Type *
                  </label>
                  <select
                    value={formFrequency}
                    onChange={(e) => setFormFrequency(e.target.value as FrequencyType)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="monthly">Monthly</option>
                    <option value="end_of_month">End of the month</option>
                    <option value="twice_a_week">Twice a week</option>
                    <option value="every_3rd_week">Every 3rd week</option>
                    <option value="every_2_months">Every 2 months</option>
                    <option value="flexible">Flexible</option>
                    <option value="once">Once</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Hours to Clean (Duration) *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0.5}
                    max={24}
                    required
                    value={formHours}
                    onChange={(e) => setFormHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono focus:outline-amber-500"
                  />
                </div>
              </div>

              {/* Row 5: Scheduled Day, Date & Assigned Staff */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Day of the Week (Anong araw) *
                  </label>
                  <select
                    value={formDay}
                    onChange={(e) => setFormDay(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                  >
                    {dayOptions.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Scheduled Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                    Cleaner Assigned (Sino ang maglilinis) *
                  </label>
                  <select
                    value={formCleaner}
                    onChange={(e) => setFormCleaner(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                  >
                    {cleaners.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.specialties[0]})</option>
                    ))}
                    <option value="Sarah Davies & Liam Johnson">Sarah Davies & Liam Johnson (Duo)</option>
                    <option value="Liam Johnson & Jack Wilson">Liam Johnson & Jack Wilson (Duo)</option>
                  </select>
                </div>
              </div>

              {/* Row 6: Remarks & Status */}
              <div>
                <label className="block font-semibold mb-1 text-neutral-700 dark:text-neutral-300">
                  Remarks / Special Instructions / Lockbox & Alarm Codes
                </label>
                <textarea
                  rows={2}
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="e.g. Key safe code 4821 by side gate; friendly Golden Retriever in backyard; leave invoice via email."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-bold transition-all shadow-sm"
                >
                  {editingClient ? 'Save Changes' : 'Create Client Agreement'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
