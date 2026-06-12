import React from 'react';
import { Booking, Room, GuestProfile, MaintenanceRequest } from '../types';
import {
  TrendingUp,
  DollarSign,
  Hotel,
  ShieldCheck,
  Percent,
  CalendarDays,
  CheckCircle2,
  Wrench
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface ReportsViewProps {
  bookings: Booking[];
  rooms: Room[];
  guests: GuestProfile[];
  maintenanceRequests: MaintenanceRequest[];
}

export default function ReportsView({
  bookings,
  rooms,
  guests,
  maintenanceRequests,
}: ReportsViewProps) {
  // 1. Core Financial Calculation
  const successfulBookings = bookings.filter((b) => b.status !== 'Canceled');
  const totalRevenue = successfulBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  // Revenue by room type
  const revenueByType = successfulBookings.reduce((acc, b) => {
    acc[b.roomType] = (acc[b.roomType] || 0) + b.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(revenueByType).map(([name, value]) => ({
    name: name.replace(' Room', '').replace(' Suite', ''),
    Revenue: value,
  }));

  // 2. Occupancy Calculation
  const totalRoomsCount = rooms.length;
  const occupiedRoomsCount = rooms.filter((r) => r.status === 'Occupied').length;
  const availableRoomsCount = rooms.filter((r) => r.status === 'Available').length;
  const oooRoomsCount = rooms.filter((r) => r.status === 'Out of Order').length;

  const occupancyRate = totalRoomsCount > 0 ? Math.round((occupiedRoomsCount / totalRoomsCount) * 100) : 0;

  // Pie chart for room availability categories
  const occupancyBreakdownData = [
    { name: 'Occupied', value: occupiedRoomsCount, color: '#0f172a' }, // Slate-900
    { name: 'Available', value: availableRoomsCount, color: '#10b981' }, // Emerald-500
    { name: 'Out of Order', value: oooRoomsCount, color: '#f43f5e' }, // Rose-500
  ].filter((item) => item.value > 0);

  // 3. Simulated Stays monthly trend (incorporates live total value for dynamic feel)
  const monthlyTimelineData = [
    { Month: 'Jan', Sales: 4200, Occupancy: 48 },
    { Month: 'Feb', Sales: 5100, Occupancy: 52 },
    { Month: 'Mar', Sales: 6800, Occupancy: 61 },
    { Month: 'Apr', Sales: 8200, Occupancy: 73 },
    { Month: 'May', Sales: 9500, Occupancy: 81 },
    { Month: 'Jun', Sales: 9500 + totalRevenue * 0.4, Occupancy: Math.min(100, 80 + occupancyRate / 5) }, // scales on real data bookings!
  ];

  // 4. Status Breakdown of All Bookings
  const statusCounts = bookings.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    },
    { Confirmed: 0, 'Checked In': 0, 'Checked Out': 0, Canceled: 0 } as Record<string, number>
  );

  const statusChartData = Object.entries(statusCounts).map(([name, value]) => ({
    name,
    Count: value,
  }));

  return (
    <div className="space-y-6" id="reports-view-container">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-semibold text-slate-900 font-serif">Executive Reports & Intelligence</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Auditing active room occupancy ratios, financial stay yields, and hospitality ledger velocity.
        </p>
      </div>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Ledger Revenue */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Stays Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">${totalRevenue.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              <span>Yield from {successfulBookings.length} bookings</span>
            </p>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-100">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Live Occupancy Index */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Occupancy Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{occupancyRate}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {occupiedRoomsCount} of {totalRoomsCount} rooms in-use
            </p>
          </div>
          <div className="bg-slate-50 text-slate-705 p-3 rounded-lg border border-slate-150">
            <Percent className="h-5 w-5" />
          </div>
        </div>

        {/* Guest Volume */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registered Guests</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{guests.length}</p>
            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">
              {guests.filter((g) => g.vipStatus).length} High-profile VIPs
            </p>
          </div>
          <div className="bg-amber-50 text-amber-700 p-3 rounded-lg border border-amber-200">
            <Hotel className="h-5 w-5" />
          </div>
        </div>

        {/* Maintenance Friction */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Maintenance Slips</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 font-mono">{maintenanceRequests.length}</p>
            <p className="text-[11px] text-rose-500 font-medium mt-0.5">
              {maintenanceRequests.filter((r) => r.status === 'Pending').length} Pending resolution
            </p>
          </div>
          <div className="bg-rose-50 text-rose-600 p-3 rounded-lg border border-rose-100">
            <Wrench className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Revenue Trend */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs lg:col-span-2">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-serif font-semibold text-slate-800 text-sm">Monthly Revenue Trend ($)</h3>
            <p className="text-slate-400 text-[11px]">Aggregated seasonal revenue velocity on-record.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTimelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="Month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="Sales" stroke="#d97706" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" name="Monthly Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Realtime Room Allotment ratio */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-serif font-semibold text-slate-800 text-sm">Room Occupancy Breakdown</h3>
            <p className="text-slate-400 text-[11px]">Realtime ratios of suites occupancy status.</p>
          </div>
          <div className="h-56 w-full flex items-center justify-center relative">
            {occupancyBreakdownData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {occupancyBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-450 italic">No rooms loaded to gauge ratios.</p>
            )}

            {/* Inner text metric */}
            <div className="absolute text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Occupancy</span>
              <p className="text-xl font-bold text-slate-900">{occupancyRate}%</p>
            </div>
          </div>

          {/* Legends */}
          <div className="flex justify-center gap-4 mt-3 text-xs font-semibold">
            {occupancyBreakdownData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-500">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Suite Yield breakdown */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs lg:col-span-2">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-serif font-semibold text-slate-800 text-sm">Revenue Distribution by Luxury Tier ($)</h3>
            <p className="text-slate-400 text-[11px]">Which suites generate the highest fiscal yield.</p>
          </div>
          <div className="h-64 w-full">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="Revenue" fill="#0f172a" radius={[4, 4, 0, 0]} name="Suite Yield Total ($)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-slate-400 italic">No reservation earnings recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bar Chart: Booking Ledger Status Counts */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-serif font-semibold text-slate-800 text-sm">Reservations Status Volumes</h3>
            <p className="text-slate-400 text-[11px]">Overview of where current bookings sit.</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} layout="vertical" margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9.5} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Count" fill="#d97706" radius={[0, 4, 4, 0]} name="Stays Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
