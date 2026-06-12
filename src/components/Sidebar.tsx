import React from 'react';
import { Role, User } from '../types';
import {
  LayoutDashboard,
  Bed,
  CalendarDays,
  Users2,
  TrendingUp,
  Brush,
  UserCheck,
  Hotel,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentUser,
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  if (!currentUser) return null;

  const role = currentUser.role;

  // Let's decide which sidebar elements to render based on user role
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['Admin', 'Manager', 'Receptionist'],
    },
    {
      id: 'rooms',
      label: 'Room Management',
      icon: Bed,
      roles: ['Admin', 'Manager', 'Receptionist'],
    },
    {
      id: 'reservations',
      label: 'Reservations',
      icon: CalendarDays,
      roles: ['Admin', 'Manager', 'Receptionist', 'Guest'],
    },
    {
      id: 'guests',
      label: 'Guest Management',
      icon: Users2,
      roles: ['Admin', 'Receptionist'],
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: TrendingUp,
      roles: ['Admin', 'Manager'],
    },
    {
      id: 'housekeeping',
      label: 'Housekeeping Desk',
      icon: Brush,
      roles: ['Admin', 'Housekeeping'],
    },
    {
      id: 'users',
      label: 'Staff Management',
      icon: UserCheck,
      roles: ['Admin'],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(role));

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile drawer backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 text-slate-100 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static`}
      >
        {/* Header (Top of Sidebar) */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="font-serif font-semibold text-lg tracking-wide text-white">
              THE GRAND PORTAL
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-md lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info (Mini view) */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover border-2 border-slate-800"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-200 truncate">
                {currentUser.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser.email}
              </p>
              <span className="inline-block mt-1 text-[9px] px-1.5 py-0.2 rounded-sm font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400">
                {role} Account
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleMenuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  isActive
                    ? 'bg-amber-600/10 text-amber-400 border-l-4 border-amber-500'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/65'
                }`}
                id={`sidebar-link-${item.id}`}
              >
                <IconComponent className={`h-4 w-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info brand */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[10px] text-slate-500 text-center">
          <p className="font-serif tracking-wider">HARBOR LUXURY GROUP</p>
          <p className="mt-0.5">V1.5.0 • RBAC Active</p>
        </div>
      </aside>
    </>
  );
}
