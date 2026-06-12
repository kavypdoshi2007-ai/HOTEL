import React, { useState } from 'react';
import { User, Role } from '../types';
import { Hotel, Key, Mail, ShieldAlert, Sparkles, AlertCircle, HelpCircle, ShieldCheck, CheckCircle2, Lock, Unlock, UserCheck, XCircle } from 'lucide-react';

interface LoginViewProps {
  allUsers: User[];
  onLoginSuccess: (user: User) => void;
}

export default function LoginView({ allUsers, onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('admin@grandresort.com');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<Role>('Admin');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Find designated user matching the typed email address
  const registeredUser = allUsers.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );

  // Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please specify both credentials.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. Strict designated/assigned role checking
    if (registeredUser) {
      if (registeredUser.role !== selectedRole) {
        setErrorMsg(
          `Security Exception: '${registeredUser.name}' is designated strictly for the '${registeredUser.role}' role. You cannot log into this coordinate as a '${selectedRole}'. Please select the assigned role.`
        );
        return;
      }

      if (password !== 'password123') {
        setErrorMsg(`Access Rejected: Invalid security password.`);
        return;
      }

      setSuccessMsg(`Authorization Verified. Opening ${registeredUser.role} Control Panel...`);
      setTimeout(() => {
        onLoginSuccess(registeredUser);
      }, 750);
    } else {
      // 2. Fallbacks for non-registered users (only Guest allowed)
      if (selectedRole === 'Guest') {
        if (password !== 'password123') {
          setErrorMsg(`Please specify standard guest credential 'password123' to construct a profile.`);
          return;
        }

        const guestName = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ');
        const customizedGuest: User = {
          id: `u-${Date.now()}`,
          name: guestName.charAt(0).toUpperCase() + guestName.slice(1) || 'Guest Traveler',
          email: email.trim(),
          role: 'Guest',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
          phone: '+1 (555) 0122',
        };
        setSuccessMsg(`Creating dynamic registered Guest file for ${customizedGuest.name}...`);
        setTimeout(() => {
          onLoginSuccess(customizedGuest);
        }, 1000);
      } else {
        setErrorMsg(`Role Assertion Failure: This email is not pre-assigned/designated to any '${selectedRole}' staff node. Only pre-registered staff are permitted.`);
      }
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`A password reset link has been dispatched to ${forgotEmail}. Please review your simulated email inbox.`);
    setShowForgotModal(false);
    setForgotEmail('');
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      id="login-view-container"
    >
      {/* Decorative luxury patterns in background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-900/5 rounded-full filter blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        {/* Hotel Logo Header */}
        <div className="mx-auto h-14 w-14 bg-slate-950 text-amber-400 p-2.5 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-500/20">
          <Hotel className="h-7 w-7" />
        </div>
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-black tracking-wider text-slate-900 uppercase">
            The Grand Harbor
          </h1>
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#d97706]">
            Luxury Resort & Residences
          </p>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-10 border border-slate-100/70 rounded-2xl shadow-xl space-y-6">
          <div className="border-b border-slate-100 pb-3 text-center">
            <h3 className="font-serif font-semibold text-slate-805 text-base">
              Hospitality Account Terminal
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your Role-Based credential matrix to initialize
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-rose-50 text-rose-600 border border-rose-100 text-xs p-3.5 rounded-lg font-medium flex items-center gap-1.5 animate-bounce">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs p-3.5 rounded-lg font-semibold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 block animate-ping" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Role selection dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Assigned Access Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                className="w-full bg-slate-50 border border-slate-205 py-2.5 px-3 rounded-lg text-xs outline-none text-slate-800 font-bold tracking-wide focus:border-amber-500 cursor-pointer"
                id="login-role-select"
              >
                <option value="Admin">Admin (Control Center)</option>
                <option value="Manager">Manager (Auditor & Staff Operations)</option>
                <option value="Receptionist">Receptionist (Reservations Lobby)</option>
                <option value="Housekeeping">Housekeeper (Suites Maintenance)</option>
                <option value="Guest">Guest (Inquire Suites & Stay History)</option>
              </select>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-705 mb-1.5 uppercase tracking-wider">
                Email Address / Coordinate
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. admin@grandresort.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-10 pr-3 py-2.5 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 pl-10 pr-3 py-2.5 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-860"
                  required
                />
              </div>
            </div>

            {/* Live Role Designation Checker Verification Dashboard */}
            {email.trim() && (
              <div className={`p-3 rounded-xl border text-xs leading-normal transition-all duration-300 ${
                registeredUser
                  ? registeredUser.role === selectedRole
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50/60 border-rose-200 text-rose-800'
                  : selectedRole === 'Guest'
                  ? 'bg-blue-50/60 border-blue-200 text-blue-800'
                  : 'bg-amber-50/60 border-amber-200 text-amber-800'
              }`}>
                {registeredUser ? (
                  registeredUser.role === selectedRole ? (
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <p className="font-extrabold uppercase tracking-wider text-[10px] text-emerald-700">
                          Designation Verified ✓
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          Secure identity confirmed. <strong>{registeredUser.name}</strong> is designated as <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">{registeredUser.role}</span>.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold uppercase tracking-wider text-[10px] text-rose-700">
                          Role Assignment Violation ✖
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          <strong>{registeredUser.name}</strong>'s profile is assigned to <span className="bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">{registeredUser.role}</span>. You cannot log in under the <strong>{selectedRole}</strong> portal.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRole(registeredUser.role);
                            setErrorMsg('');
                          }}
                          className="mt-2 text-[10px] font-bold bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded-md transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <UserCheck className="h-3 w-3" />
                          <span>Correct Role to {registeredUser.role}</span>
                        </button>
                      </div>
                    </div>
                  )
                ) : (
                  selectedRole === 'Guest' ? (
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold uppercase tracking-wider text-[10px] text-blue-700">
                          Dynamic Guest Node Entry
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          Unassigned traveler coordinate detected. Standard Guest Portal features will initialize dynamically.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <XCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold uppercase tracking-wider text-[10px] text-amber-700">
                          Unassigned Credentials Access Blocked
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          This email coordinate is not assigned to any staff profile of type <strong>{selectedRole}</strong>.
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Forgot password trigger */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-slate-400">Default password: password123</span>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-amber-700 hover:underline font-bold"
                id="forgot-password-link"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full py-3 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-1.5"
              id="login-btn-submit"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Initialize Hospitality Session</span>
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-serif font-semibold text-slate-900 text-base">Recover Credentials</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide your hotel registration email. Our reservation hub will compile and forward your matching credentials.
              </p>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Registration Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. your_email@domain.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-805"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 text-xs font-semibold pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3.5 py-1.5 border border-slate-250 text-slate-600 rounded-md hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-950 text-white rounded-md hover:bg-slate-800"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
