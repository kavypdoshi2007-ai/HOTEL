import React from 'react';
import { Room, Booking, GuestProfile, MaintenanceRequest, User } from '../types';
import {
  Bed,
  CheckCircle2,
  AlertTriangle,
  CalendarCheck,
  Plus,
  ArrowRight,
  TrendingUp,
  Brush,
  ClipboardList
} from 'lucide-react';

interface DashboardViewProps {
  rooms: Room[];
  bookings: Booking[];
  guests: GuestProfile[];
  maintenanceRequests: MaintenanceRequest[];
  currentUser: User;
  onNavigate: (tabId: string) => void;
}

export default function DashboardView({
  rooms,
  bookings,
  guests,
  maintenanceRequests,
  currentUser,
  onNavigate,
}: DashboardViewProps) {
  // Calculations
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'Available').length;
  const occupiedRooms = rooms.filter((r) => r.status === 'Occupied').length;
  const oooRooms = rooms.filter((r) => r.status === 'Out of Order').length;
  const totalBookingsCount = bookings.length;

  // Occupancy percentages
  const occupancyPercentage = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  // Filtering housekeeper statuses
  const dirtyRooms = rooms.filter((r) => r.cleaningStatus === 'Dirty').length;
  const cleanRooms = rooms.filter((r) => r.cleaningStatus === 'Clean').length;
  const cleaningInProgress = rooms.filter((r) => r.cleaningStatus === 'In Progress').length;

  // Active or upcoming reservations
  const activeBookings = bookings.filter((b) => b.status === 'Checked In');
  const upcomingBookings = bookings.filter((b) => b.status === 'Confirmed');

  return (
    <div className="space-y-6" id="dashboard-view-container">
      {/* Welcome Banner */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-600">
            Hotel Operating System
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-slate-900 mt-1">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Here is the status of the Grand Harbor Resort for today.{' '}
            <span className="font-mono text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-sm ml-1">
              Active Session: {currentUser.role}
            </span>
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs font-semibold text-slate-400">CURRENT STATUS</p>
          <p className="font-serif text-2xl font-semibold text-amber-700 mt-1">
            {occupancyPercentage}% Occupied
          </p>
          <span className="text-[10px] text-slate-400">
            {occupiedRooms} / {totalRooms} rooms filled tonight
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Rooms */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Rooms
            </p>
            <p className="text-2xl font-bold text-slate-800">{totalRooms}</p>
            <p className="text-xs text-slate-500">Across 3 luxury floors</p>
          </div>
          <div className="bg-slate-50 text-slate-500 p-3 rounded-xl border border-slate-100">
            <Bed className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Available Rooms */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-medium text-emerald-600">
              Available Rooms
            </p>
            <p className="text-2xl font-bold text-emerald-600">{availableRooms}</p>
            <p className="text-xs text-slate-500">Ready for instant check-in</p>
          </div>
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Occupied Rooms */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-medium text-slate-700">
              Occupied Rooms
            </p>
            <p className="text-2xl font-bold text-slate-800">{occupiedRooms}</p>
            <p className="text-xs text-slate-500">Currently in-house guests</p>
          </div>
          <div className="bg-slate-100 text-slate-700 p-3 rounded-xl border border-slate-200">
            <Bed className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Total Bookings */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-medium text-amber-700">
              Total Bookings
            </p>
            <p className="text-2xl font-bold text-slate-800">{totalBookingsCount}</p>
            <p className="text-xs text-slate-500">Historical & reservations</p>
          </div>
          <div className="bg-amber-50 text-amber-700 p-3 rounded-xl border border-amber-200">
            <CalendarCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Split widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Live Cleaning desk & Maintenance status */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-serif font-semibold text-slate-800 flex items-center gap-2">
                <Brush className="h-4 w-4 text-amber-600" />
                Cleaning & Maintenance
              </h3>
              {currentUser.role === 'Admin' && (
                <button
                  onClick={() => onNavigate('housekeeping')}
                  className="text-xs text-amber-700 hover:underline flex items-center gap-0.5 font-semibold"
                >
                  Go to Desk <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* Cleaning Meters */}
            <div className="space-y-4 mt-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-emerald-700 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Clean Rooms ({cleanRooms})
                  </span>
                  <span className="text-slate-500">
                    {totalRooms > 0 ? Math.round((cleanRooms / totalRooms) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: `${totalRooms > 0 ? (cleanRooms / totalRooms) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-amber-700 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Cleaning in Progress ({cleaningInProgress})
                  </span>
                  <span className="text-slate-500 font-medium">
                    {totalRooms > 0 ? Math.round((cleaningInProgress / totalRooms) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full transition-all duration-500"
                    style={{ width: `${totalRooms > 0 ? (cleaningInProgress / totalRooms) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-rose-700 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    Dirty / Pending ({dirtyRooms})
                  </span>
                  <span className="text-slate-500 font-medium">
                    {totalRooms > 0 ? Math.round((dirtyRooms / totalRooms) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-400 h-full transition-all duration-500"
                    style={{ width: `${totalRooms > 0 ? (dirtyRooms / totalRooms) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Summary */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <p className="font-semibold text-slate-700">Active Maintenance</p>
                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                  {maintenanceRequests.length} Issues
                </span>
              </div>
              <div className="mt-2.5 space-y-2">
                {maintenanceRequests.slice(0, 2).map((req) => (
                  <div key={req.id} className="text-xs flex justify-between items-start">
                    <span className="text-slate-600 font-medium truncate max-w-[170px]">
                      Room {req.roomNumber}: {req.description}
                    </span>
                    <span
                      className={`text-[9.5px] font-bold px-1.5 rounded-sm shrink-0 uppercase tracking-wider ${
                        req.severity === 'Critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}
                    >
                      {req.severity}
                    </span>
                  </div>
                ))}
                {maintenanceRequests.length === 0 && (
                  <p className="text-[11px] text-slate-500 italic">No maintenance issues reported.</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Today's Quick Action
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={() => onNavigate('reservations')}
                className="text-xs bg-slate-900 text-white font-medium p-2.5 rounded-lg text-center hover:bg-slate-800 transition shadow-xs flex items-center justify-center gap-1.5"
                id="quick-action-book"
              >
                <Plus className="h-3.5 w-3.5" /> Book Room
              </button>
              <button
                onClick={() => onNavigate('rooms')}
                className="text-xs bg-white text-slate-800 border border-slate-200 font-semibold p-2.5 rounded-lg text-center hover:bg-slate-50 transition shadow-xs flex items-center justify-center gap-1.5"
                id="quick-action-rooms"
              >
                <ClipboardList className="h-3.5 w-3.5" /> Room Grid
              </button>
            </div>
          </div>
        </div>

        {/* Center/Right column span-2: Recent Bookings & Guests */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-serif font-semibold text-slate-800 flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
                Live Bookings Stream
              </h3>
              <button
                onClick={() => onNavigate('reservations')}
                className="text-xs text-amber-700 hover:underline flex items-center gap-0.5 font-semibold"
              >
                View Reservatons <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-slate-800 text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2">Guest</th>
                    <th className="py-2">Room</th>
                    <th className="py-2">Stay Dates</th>
                    <th className="py-2 text-right">Amount</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {bookings.slice(0, 5).map((booking) => {
                    const statusBadgeColors = {
                      'Confirmed': 'bg-sky-50 text-sky-700 border border-sky-200',
                      'Checked In': 'bg-emerald-50 text-emerald-700 border border-emerald-200',
                      'Checked Out': 'bg-slate-100 text-slate-600 border border-slate-200',
                      'Canceled': 'bg-rose-50 text-rose-700 border border-rose-200',
                    };
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3">
                          <p className="font-semibold text-slate-850 truncate max-w-[120px]">{booking.guestName}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{booking.guestEmail}</p>
                        </td>
                        <td className="py-3">
                          <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                            {booking.roomNumber}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{booking.roomType}</span>
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-slate-800">{booking.checkInDate}</p>
                          <p className="text-[10px] text-slate-400">to {booking.checkOutDate}</p>
                        </td>
                        <td className="py-3 text-right font-semibold text-slate-900 font-mono">
                          ${booking.totalAmount}
                        </td>
                        <td className="py-3 text-right">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusBadgeColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span>Average nightly rate: <strong className="text-slate-800">$262.50</strong></span>
            </div>
            <span>Showing recent bookings on record</span>
          </div>
        </div>
      </div>
    </div>
  );
}
