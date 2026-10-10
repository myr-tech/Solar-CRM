import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  User,
  PlusCircle,
  MessageSquare,
  Navigation,
  CheckCircle2,
  Calendar as CalendarIcon,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { storage } from '../../services/storage';
import { Appointment, AppointmentType, AppointmentStatus } from '../../types';
import { generateGoogleMapsLink, formatDate } from '../../utils/formatters';

interface AppointmentsViewProps {
  onOpenWhatsApp: (phone: string, name: string, projectId?: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  onOpenWhatsApp,
  onSelectProject,
}) => {
  const db = storage.getDatabase();
  const [viewMode, setViewMode] = useState<'LIST' | 'DAILY' | 'WEEKLY'>('LIST');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showNewModal, setShowNewModal] = useState(false);

  // New Appointment Form State
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [projectId, setProjectId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('11:00 AM');
  const [assignedEmployeeName, setAssignedEmployeeName] = useState('Nikhil Raut (Surveyor)');
  const [type, setType] = useState<AppointmentType>('Site Survey');
  const [remarks, setRemarks] = useState('');

  const appointmentTypes: AppointmentType[] = [
    'Site Survey',
    'Customer Meeting',
    'Document Collection',
    'Installation',
    'Inspection',
    'Service Visit',
    'Payment Collection',
  ];

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !mobile || !date) {
      alert('Please fill customer name, mobile, and date.');
      return;
    }

    storage.addAppointment({
      projectId: projectId || undefined,
      customerName,
      mobile,
      address: address || 'Nagpur, Maharashtra',
      date,
      time,
      assignedEmployeeId: 'USR-04',
      assignedEmployeeName,
      type,
      status: 'Scheduled',
      remarks,
    });

    setShowNewModal(false);
    setCustomerName('');
    setMobile('');
    setAddress('');
    setProjectId('');
  };

  const handleStatusToggle = (apptId: string, currentStatus: AppointmentStatus) => {
    const nextStatus: AppointmentStatus =
      currentStatus === 'Scheduled' ? 'Completed' : 'Scheduled';
    storage.updateAppointment(apptId, { status: nextStatus });
  };

  const filteredAppointments = db.appointments.filter((appt) => {
    if (filterType === 'ALL') return true;
    return appt.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-amber-400" /> Appointments & Technician Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Schedule surveys, installations, discom inspections and service visits across Nagpur
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* View Switcher & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* View Mode Buttons */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
          {(['LIST', 'DAILY', 'WEEKLY'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                viewMode === mode
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {mode === 'LIST' ? 'All Schedules' : mode === 'DAILY' ? 'Today / Daily' : 'Weekly View'}
            </button>
          ))}
        </div>

        {/* Appointment Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Types ({db.appointments.length})</option>
            {appointmentTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            No appointments scheduled for selected filter.
          </div>
        ) : (
          filteredAppointments.map((appt) => {
            const isCompleted = appt.status === 'Completed';
            return (
              <div
                key={appt.id}
                className={`bg-slate-900 border rounded-2xl p-4 transition-all flex flex-col justify-between ${
                  isCompleted ? 'border-emerald-800/60 opacity-80' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badge & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {appt.type}
                    </span>
                    <button
                      onClick={() => handleStatusToggle(appt.id, appt.status)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-colors flex items-center gap-1 ${
                        isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{appt.status}</span>
                    </button>
                  </div>

                  {/* Customer & Project ID */}
                  <div>
                    <h3 className="text-sm font-bold text-white">{appt.customerName}</h3>
                    {appt.projectId ? (
                      <button
                        onClick={() => onSelectProject(appt.projectId!)}
                        className="text-[11px] font-mono text-amber-400 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        {appt.projectId} <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                    ) : (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">Pre-Project Lead</div>
                    )}
                  </div>

                  {/* Time and Assigned Employee */}
                  <div className="p-2.5 bg-slate-850 rounded-xl space-y-1.5 text-xs text-slate-300 border border-slate-800">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>
                        {formatDate(appt.date)} at <strong className="text-white">{appt.time}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span className="truncate">{appt.assignedEmployeeName}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] text-slate-400 line-clamp-2">{appt.address}</span>
                    </div>
                  </div>

                  {appt.remarks && (
                    <div className="text-[11px] text-slate-400 italic">"{appt.remarks}"</div>
                  )}
                </div>

                {/* Bottom Actions: WhatsApp & Google Maps */}
                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={generateGoogleMapsLink(appt.address, appt.latitude, appt.longitude)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-sky-400 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate</span>
                  </a>

                  <button
                    onClick={() => onOpenWhatsApp(appt.mobile, appt.customerName, appt.projectId)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-800 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Book Appointment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-400" /> Schedule Solar Field Appointment
            </h3>

            <form onSubmit={handleCreateAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Full Name"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9822104521"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project ID (Optional)</label>
                  <input
                    type="text"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    placeholder="FCSS-2026-0001"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Premises Address (Nagpur)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot/Flat, Society, Besa / Dharampeth / Wardha Rd"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="11:00 AM / 03:30 PM"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Appointment Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as AppointmentType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    {appointmentTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Employee</label>
                  <select
                    value={assignedEmployeeName}
                    onChange={(e) => setAssignedEmployeeName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Nikhil Raut (Surveyor)">Nikhil Raut (Site Surveyor)</option>
                    <option value="Ganesh Patil (Lead Electrician)">Ganesh Patil (Lead Electrician)</option>
                    <option value="Amit Kulkarni (Sales)">Amit Kulkarni (Sales Consultant)</option>
                    <option value="Sneha Patil (Liaison)">Sneha Patil (MSEDCL Liaison)</option>
                    <option value="Vikram Joshi (Service)">Vikram Joshi (Service AMC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Special instructions or customer availability"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
