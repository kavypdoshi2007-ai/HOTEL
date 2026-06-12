import React, { useState } from 'react';
import { GuestProfile, User } from '../types';
import {
  Search,
  Plus,
  UserCheck,
  Phone,
  Mail,
  FileBadge,
  Crown,
  Info,
  X,
  Sparkles,
  Clipboard,
  LucideCalendarDays
} from 'lucide-react';

interface GuestsViewProps {
  guests: GuestProfile[];
  currentUser: User;
  onAddGuest: (guest: Omit<GuestProfile, 'id' | 'totalBookings'>) => void;
  onUpdateGuest: (id: string, updatedGuest: Partial<GuestProfile>) => void;
}

export default function GuestsView({
  guests,
  currentUser,
  onAddGuest,
  onUpdateGuest,
}: GuestsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [idProof, setIdProof] = useState('');
  const [vipStatus, setVipStatus] = useState(false);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const canEdit = ['Admin', 'Receptionist'].includes(currentUser.role);

  // Handle Create Guest
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim() || !phone.trim() || !idProof.trim()) {
      setFormError('Please fill out all mandatory fields.');
      return;
    }

    onAddGuest({
      name,
      email,
      phone,
      idProof,
      vipStatus,
      notes,
    });

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setIdProof('');
    setVipStatus(false);
    setNotes('');
    setIsAddOpen(false);
  };

  // Filter Guests
  const filteredGuests = guests.filter((g) => {
    const term = search.toLowerCase();
    return (
      g.name.toLowerCase().includes(term) ||
      g.email.toLowerCase().includes(term) ||
      g.phone.includes(term) ||
      g.idProof.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6" id="guests-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-slate-900">Guest Directory</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Maintain high-profile visitor dossiers, preferences and stay credentials.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="self-start sm:self-auto bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer"
            id="register-guest-btn"
          >
            <Plus className="h-4 w-4 text-amber-500" />
            <span>Register New Guest</span>
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search guests by name, email, credentials, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
          />
        </div>
      </div>

      {/* Grid: Main directory table on Left, Detailed Profile Card on Right (Drawer style if item checked) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest Table (Responsive) */}
        <div className={`${selectedGuest ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Visitor Name</th>
                  <th className="py-3 px-4">ID Verification</th>
                  <th className="py-3 px-4">Contact Detail</th>
                  <th className="py-3 px-4 text-center">Stay Records</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredGuests.map((guest) => (
                  <tr
                    key={guest.id}
                    className={`hover:bg-slate-50/50 transition cursor-pointer ${
                      selectedGuest?.id === guest.id ? 'bg-amber-50/20' : ''
                    }`}
                    onClick={() => setSelectedGuest(guest)}
                  >
                    {/* Visitor Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-705 flex items-center justify-center font-bold text-xs relative">
                          {guest.name[0]}
                          {guest.vipStatus && (
                            <span className="absolute -top-1 -right-1 bg-amber-500 p-0.5 rounded-full text-white">
                              <Crown className="h-2 w-2" />
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 flex items-center gap-1">
                            {guest.name}
                            {guest.vipStatus && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-bold uppercase tracking-wider scale-90">
                                VIP
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400">{guest.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* ID Verification */}
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-150">
                        {guest.idProof}
                      </span>
                    </td>

                    {/* Contact Detail */}
                    <td className="py-3.5 px-4 text-slate-650 font-mono">
                      {guest.phone}
                    </td>

                    {/* Stay Records */}
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700 font-mono">
                      {guest.totalBookings}
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedGuest(guest);
                        }}
                        className="text-xs text-amber-700 font-bold hover:underline py-1 px-2.5 rounded hover:bg-amber-50 inline-flex items-center gap-1"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span>View Dossier</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredGuests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-slate-400 italic">
                      No guest portfolios registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guest Details Panel (Renders elegantly next to list when selected) */}
        {selectedGuest && (
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-md h-fit space-y-4 animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                  Visitor dossier
                </span>
                <h3 className="text-lg font-serif font-semibold text-slate-900 mt-0.5">
                  Profile Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Profile Avatar & Details */}
            <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-serif">
                {selectedGuest.name[0]}
              </div>
              <div>
                <h4 className="font-bold text-slate-905">{selectedGuest.name}</h4>
                <p className="text-xs text-slate-500 font-mono">Guest Id: #{selectedGuest.id}</p>
              </div>
            </div>

            {/* General Fields */}
            <div className="space-y-3.5 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>{selectedGuest.email}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="font-mono">{selectedGuest.phone}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <FileBadge className="h-4 w-4 text-slate-400" />
                <span>Verification: <strong className="font-mono text-slate-800">{selectedGuest.idProof}</strong></span>
              </div>

              {/* VIP controls */}
              <div className="flex items-center justify-between p-2.5 bg-amber-500/5 rounded-lg border border-amber-600/10">
                <div className="flex items-center gap-2 text-amber-800 font-semibold">
                  <Crown className="h-4 w-4 text-amber-500" />
                  <span>VIP Lounge Status</span>
                </div>
                {canEdit ? (
                  <button
                    onClick={() => {
                      const status = !selectedGuest.vipStatus;
                      onUpdateGuest(selectedGuest.id, { vipStatus: status });
                      setSelectedGuest({ ...selectedGuest, vipStatus: status });
                    }}
                    className={`text-[10px] font-bold px-2 py-1 rounded cursor-pointer ${
                      selectedGuest.vipStatus
                        ? 'bg-rose-50 text-rose-700 border border-rose-100'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedGuest.vipStatus ? 'Revoke VIP' : 'Promote VIP'}
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700">
                    {selectedGuest.vipStatus ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                )}
              </div>

              {/* Preference Notes */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">
                  Preferences & Staff Dossier Log
                </label>
                {canEdit ? (
                  <textarea
                    rows={3}
                    value={selectedGuest.notes || ''}
                    onChange={(e) => {
                      const notesVal = e.target.value;
                      onUpdateGuest(selectedGuest.id, { notes: notesVal });
                      setSelectedGuest({ ...selectedGuest, notes: notesVal });
                    }}
                    placeholder="Enter hospitality comments..."
                    className="w-full bg-slate-50 border border-slate-205 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-550 transition text-slate-800"
                  />
                ) : (
                  <p className="p-2.5 bg-slate-50 text-slate-600 rounded border border-slate-100 italic">
                    {selectedGuest.notes || 'No custom preferences documented.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-semibold text-base">Register Hospitality Profile</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-50 text-rose-600 text-xs p-3 rounded border border-rose-100">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Guest Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. jane@sample.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 0123"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  ID Passport/Verification (Proof)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PP-5538192"
                  value={idProof}
                  onChange={(e) => setIdProof(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 font-mono"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="vip-check"
                  checked={vipStatus}
                  onChange={(e) => setVipStatus(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="vip-check" className="text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer select-none">
                  Flag as VIP Suite Patron
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Initial Hospitality Comments (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Dislike feathers, high floor, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
