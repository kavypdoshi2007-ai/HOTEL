import React, { useState, useEffect } from 'react';
import { Booking, Room, User } from '../types';
import { ROOM_TYPES } from '../data';
import {
  CalendarDays,
  Plus,
  Search,
  CheckCircle2,
  CalendarClock,
  LogOut,
  XCircle,
  HelpCircle,
  Clock,
  User as UserIcon,
  DollarSign
} from 'lucide-react';

interface ReservationsViewProps {
  bookings: Booking[];
  rooms: Room[];
  currentUser: User;
  onAddBooking: (booking: Omit<Booking, 'id'>) => void;
  onUpdateBookingStatus: (id: string, status: Booking['status']) => void;
}

export default function ReservationsView({
  bookings,
  rooms,
  currentUser,
  onAddBooking,
  onUpdateBookingStatus,
}: ReservationsViewProps) {
  const isGuestRole = currentUser.role === 'Guest';
  const isStaffRole = ['Admin', 'Receptionist'].includes(currentUser.role);
  const isManager = currentUser.role === 'Manager';

  // Filters & State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Stay form state
  const [guestName, setGuestName] = useState(isGuestRole ? currentUser.name : '');
  const [guestEmail, setGuestEmail] = useState(isGuestRole ? currentUser.email : '');
  const [selectedRoomType, setSelectedRoomType] = useState(ROOM_TYPES[0].name);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [notes, setNotes] = useState('');

  // Auxiliary Calculations
  const [daysCount, setDaysCount] = useState(1);
  const [totalCost, setTotalCost] = useState(150);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Lock guest info if Role is Guest
  useEffect(() => {
    if (isGuestRole) {
      setGuestName(currentUser.name);
      setGuestEmail(currentUser.email);
    }
  }, [currentUser, isGuestRole]);

  // Recalculate Stay metrics
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = d2.getTime() - d1.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setDaysCount(diffDays);
        const selectedTypeObj = ROOM_TYPES.find((t) => t.name === selectedRoomType);
        const rate = selectedTypeObj ? selectedTypeObj.price : 150;
        setTotalCost(rate * diffDays);
        setBookingError('');
      } else {
        setDaysCount(0);
        setTotalCost(0);
        setBookingError('Check-out date must succeed Check-in date.');
      }
    } else {
      setDaysCount(1);
      const selectedTypeObj = ROOM_TYPES.find((t) => t.name === selectedRoomType);
      const rate = selectedTypeObj ? selectedTypeObj.price : 150;
      setTotalCost(rate);
    }
  }, [checkInDate, checkOutDate, selectedRoomType]);

  // Handle Form Submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');

    if (!guestName.trim()) {
      setBookingError('Guest Name is required.');
      return;
    }
    if (!guestEmail.trim()) {
      setBookingError('Guest Email is required.');
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setBookingError('Please enter both Check-in and Check-out dates.');
      return;
    }
    if (daysCount <= 0) {
      setBookingError('Invalid dates duration specified.');
      return;
    }

    // Try finding an available room of the selected type
    const availableRooms = rooms.filter(
      (r) => r.type === selectedRoomType && r.status === 'Available' && r.cleaningStatus === 'Clean'
    );

    // If staff is booking and chooses a specific room number, prioritise that, else auto-assign
    let assignedRoomNo = selectedRoomNumber;

    if (!assignedRoomNo) {
      if (availableRooms.length > 0) {
        assignedRoomNo = availableRooms[0].number;
      } else {
        // Find any available room of that type, even if dirty (will clean shortly)
        const backUpRooms = rooms.filter((r) => r.type === selectedRoomType && r.status === 'Available');
        if (backUpRooms.length > 0) {
          assignedRoomNo = backUpRooms[0].number;
        } else {
          // If absolutely none, we mock assigning a sequential number & mark room occupied shortly
          assignedRoomNo = `${Math.floor(Math.random() * 200) + 100}`;
        }
      }
    }

    onAddBooking({
      guestName: guestName,
      guestEmail: guestEmail,
      roomNumber: assignedRoomNo,
      roomType: selectedRoomType,
      checkInDate: checkInDate,
      checkOutDate: checkOutDate,
      status: 'Confirmed',
      totalAmount: totalCost,
      notes: notes,
    });

    setBookingSuccess(`Room ${assignedRoomNo} reserved successfully for ${guestName}!`);
    
    // Clear form except for Guests
    if (!isGuestRole) {
      setGuestName('');
      setGuestEmail('');
      setNotes('');
    }
    setCheckInDate('');
    setCheckOutDate('');
    setSelectedRoomNumber('');
  };

  // Enforce Guest RBAC Rule: Guests see only their own bookings
  const relevantBookings = bookings.filter((booking) => {
    if (isGuestRole) {
      return booking.guestEmail.toLowerCase() === currentUser.email.toLowerCase();
    }
    return true;
  });

  // Filter Bookings on search or status
  const filteredBookings = relevantBookings.filter((booking) => {
    const matchesSearch =
      booking.guestName.toLowerCase().includes(search.toLowerCase()) ||
      booking.roomNumber.includes(search) ||
      booking.guestEmail.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="reservations-view-container">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-serif font-semibold text-slate-900">Suite Reservations</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          {isGuestRole
            ? 'Access your private reservation log or book an oceanfront escape.'
            : 'Operational guest check-in desk, ledger archives, and active terminal stay logs.'}
        </p>
      </div>

      {/* Grid: Form on Left, Table on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservation Form (Hidden for Manager - Managers only view) */}
        {!isManager ? (
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs h-fit">
            <h3 className="font-serif font-semibold text-slate-800 flex items-center gap-2 pb-3 border-b border-slate-100 mb-4 text-sm">
              <CalendarDays className="h-4 w-4 text-amber-600" />
              Book Next Reservation
            </h3>

            <form onSubmit={handleBookingSubmit} className="space-y-3.5">
              {bookingError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-[11px] p-3 rounded-lg font-medium">
                  {bookingError}
                </div>
              )}

              {bookingSuccess && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] p-3 rounded-lg font-semibold">
                  {bookingSuccess}
                </div>
              )}

              {/* Guest Profile Details */}
              <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Guest Reference Email
                </p>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5 font-medium">Full Name</label>
                  <input
                    type="text"
                    disabled={isGuestRole}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded text-xs outline-none disabled:bg-slate-100 disabled:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5 font-medium">Email Address</label>
                  <input
                    type="email"
                    disabled={isGuestRole}
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded text-xs outline-none disabled:bg-slate-100 disabled:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Room Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Luxury Category Choice
                </label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} (${t.price}/night)
                    </option>
                  ))}
                </select>
              </div>

              {/* Room Specific Number (Staff only optional selection) */}
              {isStaffRole && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Assign Specific Room (Optional)
                  </label>
                  <select
                    value={selectedRoomNumber}
                    onChange={(e) => setSelectedRoomNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-705"
                  >
                    <option value="">-- Let System Auto-select --</option>
                    {rooms
                      .filter((r) => r.type === selectedRoomType && r.status === 'Available')
                      .map((r) => (
                        <option key={r.id} value={r.number}>
                          Room {r.number} ({r.cleaningStatus === 'Clean' ? 'Clean' : 'Needs Clean'})
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Dates Select */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Check-In
                  </label>
                  <input
                    type="date"
                    min="2026-06-01"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    min={checkInDate || "2026-06-01"}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Trip summary */}
              {checkInDate && checkOutDate && daysCount > 0 && (
                <div className="p-3 bg-amber-500/10 rounded-lg space-y-1">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span>Stay Duration:</span>
                    <span className="font-bold">{daysCount} night{daysCount > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-900 pt-1 border-t border-amber-600/10">
                    <span>Grand Total:</span>
                    <span className="font-mono text-amber-700 text-sm font-bold">${totalCost}</span>
                  </div>
                </div>
              )}

              {/* Booking Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Special Notes & Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Featherless pillows, extra towels, check-in past midnight..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={daysCount <= 0}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition cursor-pointer flex justify-center items-center gap-1 shadow-xs disabled:opacity-50"
                id="submit-booking-form"
              >
                <Plus className="h-4 w-4" />
                <span>Confirm Reservation</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs">
            <h3 className="font-serif font-semibold text-slate-800 pb-3 border-b border-slate-100 mb-4 text-sm">
              Role Authority: View-Only
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Your registered role is <strong>{currentUser.role}</strong>. Reception desk stays are loaded on the right panel for auditing. Stays CRUD actions are restricted to Front Desk Receptionists and General Administration Accounts.
            </p>
          </div>
        )}

        {/* Ledger logs / Reservation list table (Spans 2 columns if form is showing) */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h3 className="font-serif font-semibold text-slate-800 text-sm">
              {isGuestRole ? 'Your Stays Portfolio' : 'Grand Ledger Bookings'}
            </h3>

            {/* Micro search filter */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search guest, room..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 pl-8 pr-2.5 py-1.5 rounded-md text-[11px] outline-none text-slate-700"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-md text-[11px] outline-none text-slate-700"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-800 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Guest Info</th>
                  <th className="py-2.5">Room</th>
                  <th className="py-2.5">Dates Booked</th>
                  <th className="py-2.5 text-right">Sum</th>
                  <th className="py-2.5 text-right">Operational Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredBookings.map((booking) => {
                  const statusColors = {
                    'Confirmed': 'bg-sky-50 text-sky-700 border-sky-100',
                    'Checked In': 'bg-emerald-50 text-emerald-800 border-emerald-100',
                    'Checked Out': 'bg-slate-100 text-slate-600 border-slate-200',
                    'Canceled': 'bg-rose-50 text-rose-700 border-rose-200',
                  };

                  const canPerformCheckIn = (currentUser.role === 'Admin' || currentUser.role === 'Receptionist') && booking.status === 'Confirmed';
                  const canPerformCheckOut = (currentUser.role === 'Admin' || currentUser.role === 'Receptionist') && booking.status === 'Checked In';
                  const canCancel = (currentUser.role === 'Admin' || currentUser.role === 'Receptionist' || (isGuestRole && booking.status === 'Confirmed'));

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3">
                        <p className="font-bold text-slate-850">{booking.guestName}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{booking.guestEmail}</p>
                        {booking.notes && (
                          <span className="inline-block text-[9.5px] text-amber-600 italic bg-amber-50 px-1.5 rounded-sm mt-1 max-w-[140px] truncate">
                            “{booking.notes}”
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded-sm font-bold">
                          {booking.roomNumber}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{booking.roomType}</p>
                      </td>
                      <td className="py-3 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700">
                          <CalendarClock className="h-3 w-3 text-slate-400" />
                          <span>{booking.checkInDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-[10.5px]">
                          <LogOut className="h-3 w-3 text-slate-300" />
                          <span>{booking.checkOutDate}</span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-semibold text-slate-900 font-mono text-xs">
                        ${booking.totalAmount}
                      </td>
                      <td className="py-3 text-right space-y-1">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`inline-block py-0.5 px-2 rounded-full text-[9px] font-bold ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>

                          {/* Quick transitions */}
                          <div className="flex gap-1">
                            {canPerformCheckIn && (
                              <button
                                onClick={() => onUpdateBookingStatus(booking.id, 'Checked In')}
                                className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-2 rounded-md shadow-xs cursor-pointer flex items-center gap-0.5"
                                id={`checkin-${booking.id}`}
                              >
                                Check-In
                              </button>
                            )}

                            {canPerformCheckOut && (
                              <button
                                onClick={() => onUpdateBookingStatus(booking.id, 'Checked Out')}
                                className="text-[10px] bg-slate-950 hover:bg-slate-800 text-white font-bold py-1 px-2 rounded-md shadow-xs cursor-pointer flex items-center gap-0.5"
                                id={`checkout-${booking.id}`}
                              >
                                Check-Out
                              </button>
                            )}

                            {canCancel && booking.status === 'Confirmed' && (
                              <button
                                onClick={() => {
                                  if (confirm('Cancel this stay reservation?')) {
                                    onUpdateBookingStatus(booking.id, 'Canceled');
                                  }
                                }}
                                className="text-[10px] bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold py-1 px-2 rounded-md cursor-pointer flex items-center gap-0.5"
                                id={`cancel-${booking.id}`}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                      No matching reservations recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
