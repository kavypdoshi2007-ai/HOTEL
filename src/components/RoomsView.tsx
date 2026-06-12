import React, { useState } from 'react';
import { Room, Role, User } from '../types';
import { ROOM_TYPES } from '../data';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  SlidersHorizontal,
  Info,
  Wrench,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

interface RoomsViewProps {
  rooms: Room[];
  currentUser: User;
  onAddRoom: (room: Omit<Room, 'id' | 'maintenanceIssues'>) => void;
  onEditRoom: (id: string, updatedRoom: Partial<Room>) => void;
  onDeleteRoom: (id: string) => void;
}

export default function RoomsView({
  rooms,
  currentUser,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
}: RoomsViewProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [cleaningFilter, setCleaningFilter] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form Fields
  const [formNumber, setFormNumber] = useState('');
  const [formType, setFormType] = useState(ROOM_TYPES[0].name);
  const [formPrice, setFormPrice] = useState(150);
  const [formStatus, setFormStatus] = useState<'Available' | 'Occupied' | 'Out of Order'>('Available');
  const [formCleaningStatus, setFormCleaningStatus] = useState<'Clean' | 'Dirty' | 'In Progress'>('Clean');
  const [formFloor, setFormFloor] = useState(1);

  // Errors
  const [error, setError] = useState('');

  const isAdmin = currentUser.role === 'Admin';
  const isManager = currentUser.role === 'Manager';
  const isReceptionist = currentUser.role === 'Receptionist';
  const isHousekeeping = currentUser.role === 'Housekeeping';

  // Open modal for Adding
  const openAddModal = () => {
    setEditingRoom(null);
    setFormNumber('');
    setFormType(ROOM_TYPES[0].name);
    setFormPrice(ROOM_TYPES[0].price);
    setFormStatus('Available');
    setFormCleaningStatus('Clean');
    setFormFloor(1);
    setError('');
    setIsModalOpen(true);
  };

  // Open modal for Editing
  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormNumber(room.number);
    setFormType(room.type);
    setFormPrice(room.price);
    setFormStatus(room.status);
    setFormCleaningStatus(room.cleaningStatus);
    setFormFloor(room.floor);
    setError('');
    setIsModalOpen(true);
  };

  // Handle room type change (helps autocomplete price)
  const handleTypeChange = (typeName: string) => {
    setFormType(typeName);
    const selected = ROOM_TYPES.find((t) => t.name === typeName);
    if (selected) {
      setFormPrice(selected.price);
    }
  };

  // Submit Room modal
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formNumber.trim()) {
      setError('Room number is required');
      return;
    }

    // Check duplicate room number
    const isDuplicate = rooms.some(
      (r) => r.number === formNumber && (!editingRoom || r.id !== editingRoom.id)
    );
    if (isDuplicate) {
      setError(`Room number ${formNumber} already exists.`);
      return;
    }

    if (editingRoom) {
      // Edit
      onEditRoom(editingRoom.id, {
        number: formNumber,
        type: formType,
        price: Number(formPrice),
        status: formStatus,
        cleaningStatus: formCleaningStatus,
        floor: Number(formFloor),
      });
    } else {
      // Create
      onAddRoom({
        number: formNumber,
        type: formType,
        price: Number(formPrice),
        status: formStatus,
        cleaningStatus: formCleaningStatus,
        floor: Number(formFloor),
      });
    }

    setIsModalOpen(false);
  };

  // Housekeeping & Receptionist Quick updates
  const handleQuickCleaningUpdate = (roomId: string, status: 'Clean' | 'Dirty' | 'In Progress') => {
    onEditRoom(roomId, { cleaningStatus: status });
  };

  const handleQuickStatusUpdate = (roomId: string, status: 'Available' | 'Occupied' | 'Out of Order') => {
    onEditRoom(roomId, { status: status });
  };

  // Filter Rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.number.includes(search) || room.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || room.type === typeFilter;
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    const matchesCleaning = cleaningFilter === 'All' || room.cleaningStatus === cleaningFilter;
    return matchesSearch && matchesType && matchesStatus && matchesCleaning;
  });

  return (
    <div className="space-y-6" id="rooms-view-container">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-slate-900">Room Directory</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            {isAdmin
              ? 'Add, edit, and delete suites or monitor the active status parameters.'
              : 'Real-time room availability, floor statistics, and housekeeping status indicators.'}
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={openAddModal}
            className="self-start sm:self-auto bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-xs transition cursor-pointer"
            id="add-room-btn"
          >
            <Plus className="h-4 w-4 text-amber-500" />
            <span>Add New Room</span>
          </button>
        )}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search suite number or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
          />
        </div>

        {/* Room Type Filter */}
        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-700"
          >
            <option value="All">All Room Types</option>
            {ROOM_TYPES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-700"
          >
            <option value="All">All Occupancies</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Out of Order">Out of Order</option>
          </select>
        </div>

        {/* Cleaning Filter */}
        <div>
          <select
            value={cleaningFilter}
            onChange={(e) => setCleaningFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-700"
          >
            <option value="All">All Cleaning Statuses</option>
            <option value="Clean">Clean</option>
            <option value="Dirty">Dirty</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Room No.</th>
                <th className="py-3 px-4">Floor</th>
                <th className="py-3 px-4">Luxury Classification</th>
                <th className="py-3 px-4">Suite Base Pricing</th>
                <th className="py-3 px-4">Occupancy Status</th>
                <th className="py-3 px-4">Cleaning Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRooms.map((room) => {
                const statusColors = {
                  'Available': 'bg-emerald-50 text-emerald-800 border-emerald-100',
                  'Occupied': 'bg-slate-100 text-slate-755 border-slate-200',
                  'Out of Order': 'bg-rose-50 text-rose-800 border-rose-200',
                };

                const cleanColors = {
                  'Clean': 'bg-emerald-50 text-emerald-700 border-emerald-100',
                  'Dirty': 'bg-rose-50 text-rose-700 border-rose-100',
                  'In Progress': 'bg-amber-50 text-amber-700 border-amber-200',
                };

                return (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition">
                    {/* Room Number */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block">
                        Room {room.number}
                      </div>
                    </td>

                    {/* Floor */}
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      Level {room.floor}
                    </td>

                    {/* Type */}
                    <td className="py-3.5 px-4 text-slate-800">
                      <div>
                        <p className="font-semibold text-slate-800">{room.type}</p>
                        <p className="text-[10px] text-slate-400">
                          Capacity of {room.type.includes('Penthouse') ? 6 : room.type.includes('Suite') ? 4 : 2} Guests
                        </p>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 font-mono text-sm">
                      ${room.price}/night
                    </td>

                    {/* Occupancy Status */}
                    <td className="py-3.5 px-4">
                      {isAdmin || isReceptionist || isManager ? (
                        <select
                          value={room.status}
                          onChange={(e) => handleQuickStatusUpdate(room.id, e.target.value as any)}
                          className={`text-xs px-2 py-1 rounded-sm border font-semibold outline-none focus:ring-1 focus:ring-amber-500/20 cursor-pointer ${
                            statusColors[room.status]
                          }`}
                        >
                          <option value="Available">Available</option>
                          <option value="Occupied">Occupied</option>
                          <option value="Out of Order">Out of Order</option>
                        </select>
                      ) : (
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-sm border ${statusColors[room.status]}`}>
                          {room.status}
                        </span>
                      )}
                    </td>

                    {/* Cleaning Status */}
                    <td className="py-3.5 px-4">
                      {isAdmin || isHousekeeping || isReceptionist || isManager ? (
                        <select
                          value={room.cleaningStatus}
                          onChange={(e) => handleQuickCleaningUpdate(room.id, e.target.value as any)}
                          className={`text-xs px-2 py-1 rounded-sm border font-semibold outline-none focus:ring-1 focus:ring-amber-500/20 cursor-pointer ${
                            cleanColors[room.cleaningStatus]
                          }`}
                        >
                          <option value="Clean">Clean</option>
                          <option value="Dirty">Dirty</option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      ) : (
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded border ${cleanColors[room.cleaningStatus]}`}>
                          {room.cleaningStatus}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {isAdmin ? (
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openEditModal(room)}
                            className="p-1 px-1.5 rounded-md hover:bg-amber-50 text-amber-600 hover:text-amber-800"
                            title="Edit Room"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete Room ${room.number}?`)) {
                                onDeleteRoom(room.id);
                              }
                            }}
                            className="p-1 px-1.5 rounded-md hover:bg-rose-50 text-rose-500 hover:text-rose-700"
                            title="Delete Room"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-slate-400 italic text-[11px] font-normal">
                          Read-Only
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No rooms cataloged matching your parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-semibold text-base">
                {editingRoom ? `Edit Room ${editingRoom.number}` : 'Register New Suite'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-3 rounded-lg font-medium flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500 block shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Room Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Room Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 104, 305"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
                  required
                />
              </div>

              {/* Floor Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Floor Level
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={formFloor}
                  onChange={(e) => setFormFloor(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
                  required
                />
              </div>

              {/* Type Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Luxury Category Classification
                </label>
                <select
                  value={formType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t.name} value={t.name}>
                      {t.name} (Base: ${t.price}/night)
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Night */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Custom Base Rate per Night ($)
                </label>
                <input
                  type="number"
                  min={50}
                  max={5000}
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none focus:border-amber-500 transition text-slate-800"
                  required
                />
              </div>

              {/* Room Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Room Lease
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Out of Order">Out of Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                    Housekeeping Status
                  </label>
                  <select
                    value={formCleaningStatus}
                    onChange={(e) => setFormCleaningStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs outline-none text-slate-800"
                  >
                    <option value="Clean">Clean</option>
                    <option value="Dirty">Dirty</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
                >
                  {editingRoom ? 'Save Changes' : 'Register Suite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
