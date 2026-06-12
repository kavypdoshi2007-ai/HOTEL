import React, { useState } from 'react';
import { User, Role } from '../types';
import { Shield, Plus, Mail, Phone, Users2, Trash2, Key, X } from 'lucide-react';

interface UsersViewProps {
  users: User[];
  currentUser: User;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onUpdateUserRole: (id: string, role: Role) => void;
  onDeleteUser: (id: string) => void;
}

export default function UsersView({
  users,
  currentUser,
  onAddUser,
  onUpdateUserRole,
  onDeleteUser,
}: UsersViewProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('Receptionist');
  const [error, setError] = useState('');

  const roleLabels: Record<Role, string> = {
    Admin: 'General Administrator',
    Manager: 'Hotel General Manager',
    Receptionist: 'Front Desk Receptionist',
    Housekeeping: 'Housekeeping Specialist',
    Guest: 'Registered Suite Guest',
  };

  const roleColors: Record<Role, string> = {
    Admin: 'bg-rose-50 text-rose-800 border border-rose-200',
    Manager: 'bg-amber-50 text-amber-800 border border-amber-200',
    Receptionist: 'bg-teal-50 text-teal-700 border border-teal-200',
    Housekeeping: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    Guest: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and Email are mandatory.');
      return;
    }

    // Check duplicate email
    const duplicate = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (duplicate) {
      setError(`A user with email ${email} already has credentials.`);
      return;
    }

    // Default avatar based on role
    const avatars = {
      Admin: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      Manager: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      Receptionist: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      Housekeeping: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      Guest: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    };

    onAddUser({
      name,
      email,
      phone,
      role,
      avatar: avatars[role],
    });

    // Reset Form
    setName('');
    setEmail('');
    setPhone('');
    setRole('Receptionist');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6" id="users-view-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-slate-900">User & Staff Directory</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Admin permission console. Audit internal credentials or adjust Role-Based Access controls dynamically.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="self-start sm:self-auto bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer"
          id="register-staff-btn"
        >
          <Plus className="h-4 w-4 text-amber-400" />
          <span>Register Staff Member</span>
        </button>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              {/* Header metadata */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="h-11 w-11 rounded-full object-cover border border-slate-100" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{u.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {u.id}</span>
                  </div>
                </div>

                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${roleColors[u.role]}`}>
                  {u.role}
                </span>
              </div>

              {/* Bio Details */}
              <div className="mt-4 space-y-2 text-xs text-slate-500 font-medium border-t border-slate-50 pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{u.email}</span>
                </div>
                {u.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-mono">{u.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  <span>Classification: <strong>{roleLabels[u.role]}</strong></span>
                </div>
              </div>
            </div>

            {/* Footer controls (Prevent self-deletion/restructuring) */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
              {u.id !== currentUser.id ? (
                <>
                  <div className="flex items-center gap-1">
                    <label className="text-[9px] font-bold text-slate-405 uppercase">Classified Role:</label>
                    <select
                      value={u.role}
                      onChange={(e) => onUpdateUserRole(u.id, e.target.value as Role)}
                      className="bg-slate-50 border border-slate-200 px-1.5 py-1 rounded text-[10px] uppercase font-bold text-slate-700 outline-none"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Housekeeping">Housekeeper</option>
                      <option value="Guest">Guest</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Revoke credentials and erase file for ${u.name}?`)) {
                        onDeleteUser(u.id);
                      }
                    }}
                    className="p-1.5 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-700 transition"
                    title="Erase User"
                    id={`delete-user-${u.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <span className="text-[10px] text-amber-700 font-bold italic uppercase tracking-wider bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                  ⭐ Current Active Login Account
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-105 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-semibold text-base">Provision Credentials</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-3 rounded font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Full Account Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liam Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Operational Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. liam@grandresort.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Phone Coordinates (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. +1 (555) 0122"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Assigned Operational Role (RBAC)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 font-semibold"
                >
                  <option value="Admin">Admin (Full Control Access)</option>
                  <option value="Manager">Manager (Reports & View logs)</option>
                  <option value="Receptionist">Receptionist (Bookings & Check-In)</option>
                  <option value="Housekeeping">Housekeeper (Update Cleanliness)</option>
                  <option value="Guest">Guest (Self Reservation portal)</option>
                </select>
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
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
