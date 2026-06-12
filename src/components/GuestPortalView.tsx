import React, { useState } from 'react';
import { Room, Booking, User } from '../types';
import { ROOM_TYPES } from '../data';
import {
  Search,
  Bed,
  Compass,
  Sparkles,
  CalendarCheck,
  ChevronRight,
  User as UserIcon,
  ShieldCheck,
  Award,
  DollarSign
} from 'lucide-react';

interface GuestPortalViewProps {
  rooms: Room[];
  bookings: Booking[];
  currentUser: User;
  onNavigateToReservations: () => void;
  onQuickBookRoom: (roomType: string, totalDays: number) => void;
}

export default function GuestPortalView({
  rooms,
  bookings,
  currentUser,
  onNavigateToReservations,
  onQuickBookRoom,
}: GuestPortalViewProps) {
  const [nightCount, setNightCount] = useState(2);
  const [successMsg, setSuccessMsg] = useState('');

  // Self bookings history
  const selfBookings = bookings.filter(
    (b) => b.guestEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  // Unsplash images corresponding to different suites to create a breathtaking resort vibes!
  const suiteImages: Record<string, string> = {
    'Classic Double Twin': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600',
    'Classic King Room': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600',
    'Grand Ocean Suite': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600',
    'Lakeside Executive Suite': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600',
    'Royal Imperial Penthouse': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600',
  };

  const handleBookSelectedSuite = (roomType: string) => {
    onQuickBookRoom(roomType, nightCount);
    setSuccessMsg(`Your reservation request for "${roomType}" (${nightCount} Nights) has been placed!`);
    setTimeout(() => {
      setSuccessMsg('');
      onNavigateToReservations();
    }, 2000);
  };

  return (
    <div className="space-y-8" id="guest-portal-view-container">
      {/* Editorial Header */}
      <div className="bg-slate-950 text-white border border-slate-900 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600"
            alt="Resort aerial"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Backdrop radial glow */}
        <div className="absolute inset-0 bg-radial-at-t from-amber-700/10 via-slate-950/40 to-slate-950" />

        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold">
            <Award className="h-3.5 w-3.5" />
            <span>Grand Club Lounge Elite Member</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tight text-white leading-tight">
            Exquisite Coastal Living{' '}
            <span className="text-amber-400 block sm:inline">Reimagined</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-md">
            Welcome, {currentUser.name}. Enjoy curated butler care, private yacht excursions and elite spa facilities tailored for the Discerning Traveler.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            {/* Quick check-in helper */}
            <div className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-xs flex items-center gap-2.5">
              <div>
                <span className="text-[10px] text-slate-450 block uppercase font-bold">Configure Stay Nights</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={nightCount}
                  onChange={(e) => setNightCount(Math.max(1, Number(e.target.value)))}
                  className="bg-transparent text-white font-serif font-bold text-sm w-16 outline-none border-b border-amber-400 mt-1"
                />
              </div>
            </div>

            <button
              onClick={onNavigateToReservations}
              className="text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition py-3.5 px-6 rounded-xl block h-fit shadow-lg shadow-amber-500/10"
            >
              Check Booking Records
            </button>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-4 rounded-xl font-semibold max-w-lg mx-auto text-center shadow-lg">
          {successMsg}
        </div>
      )}

      {/* Catalog of Suites */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-serif font-semibold text-slate-950">Accommodations Portfolio</h3>
          <p className="text-xs text-slate-500">
            A hand-picked roster of luxury chambers with premium linens, bathhouses and scenic backdrops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ROOM_TYPES.map((suite) => {
            const availableCount = rooms.filter((r) => r.type === suite.name && r.status === 'Available').length;
            const liveImage = suiteImages[suite.name] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150';

            return (
              <div
                key={suite.name}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual image & Availability Badge */}
                <div className="h-48 relative overflow-hidden">
                  <img src={liveImage} alt={suite.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  <span className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-1 rounded-full border shadow-sm ${
                    availableCount > 0
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                      : 'bg-rose-50 text-rose-800 border-rose-100'
                  }`}>
                    {availableCount > 0 ? `${availableCount} Available Stays` : 'Fully Rented Tonight'}
                  </span>

                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[10px] bg-slate-950/40 backdrop-blur-xs px-2 py-0.5 rounded font-bold uppercase tracking-widest inline-block mb-1">
                      Capacity: {suite.capacity} Guests
                    </p>
                  </div>
                </div>

                {/* Info and price */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <h4 className="font-serif font-semibold text-slate-900 group-hover:text-amber-700 transition">
                        {suite.name}
                      </h4>
                      <p className="text-xs font-mono font-bold text-amber-800">
                        ${suite.price}<span className="text-slate-400 font-sans font-medium">/n</span>
                      </p>
                    </div>

                    <p className="text-slate-500 text-[11.5px] leading-relaxed">
                      {suite.description}
                    </p>
                  </div>

                  {/* Pricing Estimation & Book button */}
                  <div className="pt-3.5 border-t border-slate-50 flex items-center justify-between gap-2.5">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase tracking-wide block font-semibold">
                        Estimated stay ({nightCount} nights)
                      </span>
                      <strong className="text-slate-900 font-mono text-xs">${suite.price * nightCount} USD</strong>
                    </div>

                    <button
                      onClick={() => handleBookSelectedSuite(suite.name)}
                      className="text-[11px] font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition py-2 px-3.5 rounded-lg flex items-center gap-0.5 cursor-pointer"
                      id={`book-${suite.name.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      <span>Inquire Reservation</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guest Loyalty reservation ledger */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="font-serif font-semibold text-slate-900">Your Recent Escapes</h3>
        <p className="text-[11.5px] text-slate-400">Archived stays and real-time ledger check-in tracking.</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800 border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Room</th>
                <th className="py-2.5">Type Class</th>
                <th className="py-2.5">Dates Booked</th>
                <th className="py-2.5 text-right font-mono">Ledger Sum</th>
                <th className="py-2.5 text-right">Reservation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {selfBookings.map((b) => {
                const badgeStyle = {
                  'Confirmed': 'bg-sky-50 text-sky-700 border-sky-100',
                  'Checked In': 'bg-emerald-50 text-emerald-800 border-emerald-100',
                  'Checked Out': 'bg-slate-100 text-slate-600 border-slate-180',
                  'Canceled': 'bg-rose-50 text-rose-700 border-rose-100',
                };
                return (
                  <tr key={b.id}>
                    <td className="py-3">
                      <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold text-[11px]">
                        Suite {b.roomNumber}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-slate-800">{b.roomType}</td>
                    <td className="py-3 font-mono">{b.checkInDate} to {b.checkOutDate}</td>
                    <td className="py-3 text-right font-mono text-slate-900 font-bold">${b.totalAmount}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle[b.status]}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {selfBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                    You have no cataloged resort stays logged on this account.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
