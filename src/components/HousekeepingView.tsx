import React, { useState } from 'react';
import { Room, MaintenanceRequest, User } from '../types';
import {
  Brush,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Compass,
  Zap,
  Hammer
} from 'lucide-react';

interface HousekeepingViewProps {
  rooms: Room[];
  maintenanceRequests: MaintenanceRequest[];
  currentUser: User;
  onUpdateCleaningStatus: (roomId: string, status: Room['cleaningStatus']) => void;
  onAddMaintenanceRequest: (request: Omit<MaintenanceRequest, 'id' | 'reportedAt'>) => void;
  onResolveMaintenance: (id: string) => void;
}

export default function HousekeepingView({
  rooms,
  maintenanceRequests,
  currentUser,
  onUpdateCleaningStatus,
  onAddMaintenanceRequest,
  onResolveMaintenance,
}: HousekeepingViewProps) {
  // Form states
  const [roomNo, setRoomNo] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Critical'>('Mild');
  const [successMsg, setSuccessMsg] = useState('');

  const [activeSegment, setActiveSegment] = useState<'all' | 'dirty' | 'inprogress' | 'clean'>('all');

  // Add Maintenance Slip
  const handleReportIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNo.trim() || !description.trim()) return;

    onAddMaintenanceRequest({
      roomNumber: roomNo,
      description,
      status: 'Pending',
      severity,
    });

    setSuccessMsg(`Issue logged successfully for Room ${roomNo}!`);
    setRoomNo('');
    setDescription('');
    setSeverity('Mild');

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Filter list of rooms
  const filteredRooms = rooms.filter((room) => {
    if (activeSegment === 'dirty') return room.cleaningStatus === 'Dirty';
    if (activeSegment === 'inprogress') return room.cleaningStatus === 'In Progress';
    if (activeSegment === 'clean') return room.cleaningStatus === 'Clean';
    return true; // all
  });

  return (
    <div className="space-y-6" id="housekeeping-view-container">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-semibold text-slate-900">Housekeeping & Maintenance Terminal</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
          Mark cleaned suites, cycle priorities, and communicate facility maintenance blocks instantly.
        </p>
      </div>

      {/* Grid: Cleaning Board & Maintenance Logger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Room Clean Statuses (2 Columns width) */}
        <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
            <h3 className="font-serif font-semibold text-slate-800 text-sm flex items-center gap-1.5ClassName">
              <Brush className="h-4 w-4 text-amber-600" />
              <span>Attendant Suite Board</span>
            </h3>

            {/* Quick Filter tabs */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {(['all', 'dirty', 'inprogress', 'clean'] as const).map((seg) => (
                <button
                  key={seg}
                  onClick={() => setActiveSegment(seg)}
                  className={`text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-md transition cursor-pointer ${
                    activeSegment === seg ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list of room status items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRooms.map((room) => {
              const borderColors = {
                Dirty: 'border-rose-200 bg-rose-50/20',
                'In Progress': 'border-amber-200 bg-amber-50/10',
                Clean: 'border-emerald-200 bg-emerald-50/10',
              };

              const badgeColors = {
                Dirty: 'bg-rose-100 text-rose-800',
                'In Progress': 'bg-amber-100 text-amber-800',
                Clean: 'bg-emerald-100 text-emerald-800',
              };

              return (
                <div
                  key={room.id}
                  className={`border rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md transition ${
                    borderColors[room.cleaningStatus]
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-sm font-bold text-slate-900 bg-slate-900/5 px-2.5 py-0.5 rounded-md">
                        Room {room.number}
                      </span>
                      <p className="text-[10px] text-slate-500 mt-1.5 font-semibold block">{room.type}</p>
                      <span className="text-[9.5px] text-slate-400 mt-0.5 block">Level {room.floor}</span>
                    </div>

                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColors[room.cleaningStatus]}`}>
                      {room.cleaningStatus}
                    </span>
                  </div>

                  {/* Actions to update status */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-1 items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Actions:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => onUpdateCleaningStatus(room.id, 'Dirty')}
                        className={`text-[9.5px] font-bold px-2 py-1 rounded cursor-pointer ${
                          room.cleaningStatus === 'Dirty' ? 'bg-rose-650 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-205'
                        }`}
                      >
                        Dirty
                      </button>
                      <button
                        onClick={() => onUpdateCleaningStatus(room.id, 'In Progress')}
                        className={`text-[9.5px] font-bold px-2 py-1 rounded cursor-pointer ${
                          room.cleaningStatus === 'In Progress' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Clean WIP
                      </button>
                      <button
                        onClick={() => onUpdateCleaningStatus(room.id, 'Clean')}
                        className={`text-[9.5px] font-bold px-2 py-1 rounded cursor-pointer ${
                          room.cleaningStatus === 'Clean' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Cleaned
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredRooms.length === 0 && (
              <p className="col-span-2 py-12 text-center text-slate-450 italic text-xs">
                No rooms logged in this criteria segment.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Maintenance Dispatch */}
        <div className="space-y-6">
          {/* Logger form */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs">
            <h3 className="font-serif font-semibold text-slate-800 text-sm flex items-center gap-1.5 pb-2.5 border-b border-slate-50 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 animate-pulse" />
              <span>Log Maintenance Issue</span>
            </h3>

            <form onSubmit={handleReportIssue} className="space-y-3.5">
              {successMsg && (
                <div className="bg-emerald-50 text-emerald-700 text-xs p-3 rounded font-bold">
                  {successMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-705 mb-1 uppercase tracking-wider">
                  Room Target
                </label>
                <select
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800 font-semibold"
                  required
                >
                  <option value="">-- Choose Room Number --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.number}>
                      Room {r.number} ({r.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-750 mb-1 uppercase tracking-wider">
                  Severity classification
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['Mild', 'Moderate', 'Critical'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`text-[10px] py-2 px-1 rounded-md font-bold text-center border cursor-pointer ${
                        severity === sev
                          ? sev === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : sev === 'Moderate'
                            ? 'bg-amber-50 text-amber-705 border-amber-300'
                            : 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Issue Description
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Shower drain clogged, window glass crack, thermostat not responding..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-950 text-white text-xs font-bold hover:bg-slate-800 transition rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                id="report-issue-btn"
              >
                <Hammer className="h-4 w-4 text-amber-500" />
                <span>Submit Ticket</span>
              </button>
            </form>
          </div>

          {/* List of active maintenance issues */}
          <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-xs">
            <h3 className="font-serif font-semibold text-slate-800 text-sm pb-2 border-b border-slate-50 mb-3">
              Active Facility Logs ({maintenanceRequests.length})
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {maintenanceRequests.map((req) => (
                <div key={req.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-900 font-mono">Room {req.roomNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 rounded-full ${
                        req.severity === 'Critical'
                          ? 'bg-rose-150 text-rose-800'
                          : req.severity === 'Moderate'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-300 text-slate-800'
                      }`}
                    >
                      {req.severity}
                    </span>
                  </div>
                  <p className="text-slate-605 leading-relaxed">{req.description}</p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>Logged: {req.reportedAt}</span>

                    <button
                      onClick={() => onResolveMaintenance(req.id)}
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
              {maintenanceRequests.length === 0 && (
                <p className="text-center text-slate-400 italic text-xs py-4">No active repairs queued.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
