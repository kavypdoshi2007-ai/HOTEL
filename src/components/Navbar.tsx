import React from 'react';
import { User, Role } from '../types';
import { Hotel, LogOut, Bell, Shield, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  allUsers: User[];
  onLogout: () => void;
  onSwitchUser: (userId: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Navbar({
  currentUser,
  allUsers,
  onLogout,
  onSwitchUser,
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarProps) {
  const [showRoleSwitches, setShowRoleSwitches] = React.useState(false);

  const roleColors: Record<Role, string> = {
    Admin: 'bg-rose-50 text-rose-700 border border-rose-200',
    Manager: 'bg-amber-50 text-amber-800 border border-amber-200',
    Receptionist: 'bg-teal-50 text-teal-700 border border-teal-200',
    Housekeeping: 'bg-cyan-50 text-cyan-700 border border-cyan-200',
    Guest: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6">
      {/* Brand & Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-50"
          id="mobile-menu-btn"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-slate-950 text-amber-400 p-1.5 rounded-lg flex items-center justify-center">
            <Hotel className="h-5 w-5" />
          </div>
          <span className="font-serif font-semibold text-lg tracking-wide hidden sm:block text-slate-900">
            THE GRAND HARBOR <span className="text-amber-600">RESORT</span>
          </span>
          <span className="font-serif font-semibold text-lg tracking-wide sm:hidden text-slate-900">
            GRAND RESORT
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {currentUser && (
          <>
            {/* Quick Demo Switcher - Restricted strictly to Admin/Designated user */}
            {currentUser.role === 'Admin' && (
              <div className="relative animate-in fade-in duration-200">
                <button
                  onClick={() => setShowRoleSwitches(!showRoleSwitches)}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  id="role-switch-btn"
                >
                  <Shield className="h-3 w-3 text-amber-600" />
                  <span>Quick RBAC Switch</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showRoleSwitches && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-100 shadow-xl py-2 z-50">
                    <div className="px-3 py-1.5 border-b border-slate-50 mb-1">
                      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Impersonate RBAC Role
                      </p>
                    </div>
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSwitchUser(user.id);
                          setShowRoleSwitches(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs ${
                          currentUser.id === user.id
                            ? 'bg-amber-50 text-amber-900 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                        id={`switch-to-${user.role.toLowerCase()}`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-5 w-5 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-slate-800 leading-tight">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                            roleColors[user.role]
                          }`}
                        >
                          {user.role}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notification Bell */}
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 relative">
              <span className="absolute top-1 right-1.5 h-2 w-2 bg-amber-600 rounded-full animate-ping" />
              <span className="absolute top-1 right-1.5 h-2 w-2 bg-amber-600 rounded-full" />
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile widget */}
            <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden md:block text-right">
                <p className="text-xs font-semibold text-slate-800">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1 justify-end mt-0.5">
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      roleColors[currentUser.role]
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Logout"
                id="logout-btn"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
