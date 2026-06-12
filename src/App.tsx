import React, { useState, useEffect } from 'react';
import { User, Room, Booking, GuestProfile, MaintenanceRequest, Role } from './types';
import {
  INITIAL_USERS,
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_GUESTS,
  INITIAL_MAINTENANCE,
  ROOM_TYPES
} from './data';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import RoomsView from './components/RoomsView';
import ReservationsView from './components/ReservationsView';
import GuestsView from './components/GuestsView';
import ReportsView from './components/ReportsView';
import HousekeepingView from './components/HousekeepingView';
import UsersView from './components/UsersView';
import GuestPortalView from './components/GuestPortalView';
import LoginView from './components/LoginView';

export default function App() {
  // 1. Core States utilizing localStorage backups
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gh_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('gh_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('gh_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [guests, setGuests] = useState<GuestProfile[]>(() => {
    const saved = localStorage.getItem('gh_guests');
    return saved ? JSON.parse(saved) : INITIAL_GUESTS;
  });

  const [maintenance, setMaintenance] = useState<MaintenanceRequest[]>(() => {
    const saved = localStorage.getItem('gh_maintenance');
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE;
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gh_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rooms' | 'reservations' | 'guests' | 'reports' | 'housekeeping' | 'users' | 'guestportal'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 2. Persistent Backups to localStorage
  useEffect(() => {
    localStorage.setItem('gh_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gh_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('gh_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('gh_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('gh_maintenance', JSON.stringify(maintenance));
  }, [maintenance]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gh_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('gh_current_user');
    }
  }, [currentUser]);

  // Adjust default view dynamically based on user role upon login
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Housekeeping') {
        setActiveTab('housekeeping');
      } else if (currentUser.role === 'Guest') {
        setActiveTab('guestportal');
      } else {
        setActiveTab('dashboard');
      }
    }
  }, [currentUser]);

  // 3. Operational Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSwitchUser = (userId: string) => {
    const selected = users.find((u) => u.id === userId);
    if (selected) {
      setCurrentUser(selected);
    }
  };

  // ROOM CRUD
  const handleAddRoom = (newRoom: Omit<Room, 'id' | 'maintenanceIssues'>) => {
    const room: Room = {
      ...newRoom,
      id: `r-${Date.now()}`,
      maintenanceIssues: [],
    };
    setRooms((prev) => [...prev, room]);
  };

  const handleEditRoom = (id: string, updatedFields: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updatedFields } : r))
    );
  };

  const handleDeleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  // BOOKING OPERATIONS
  const handleAddBooking = (newBooking: Omit<Booking, 'id'>) => {
    const bookingId = `b-${Math.floor(Math.random() * 900) + 100}`;
    const booking: Booking = {
      ...newBooking,
      id: bookingId,
    };

    setBookings((prev) => [booking, ...prev]);

    // Check if guest is cataloged, if not create record
    const exists = guests.some((g) => g.email.toLowerCase() === newBooking.guestEmail.toLowerCase());
    if (!exists) {
      const newGuestRecord: GuestProfile = {
        id: `g-${Date.now()}`,
        name: newBooking.guestName,
        email: newBooking.guestEmail,
        phone: '+1 (555) 0100',
        idProof: 'PP-NEW' + Math.floor(Math.random() * 1000),
        vipStatus: false,
        totalBookings: 1,
        notes: newBooking.notes || 'Registered during room booking.',
      };
      setGuests((prev) => [...prev, newGuestRecord]);
    } else {
      // Increment booking count
      setGuests((prev) =>
        prev.map((g) =>
          g.email.toLowerCase() === newBooking.guestEmail.toLowerCase()
            ? { ...g, totalBookings: g.totalBookings + 1 }
            : g
        )
      );
    }

    // Automatically reserve the room status if checked-in immediately (simulated)
    if (newBooking.status === 'Checked In') {
      setRooms((prev) =>
        prev.map((r) => (r.number === newBooking.roomNumber ? { ...r, status: 'Occupied' } : r))
      );
    }
  };

  const handleUpdateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );

    const targetBooking = bookings.find((b) => b.id === id);
    if (!targetBooking) return;

    if (status === 'Checked In') {
      // Mark room occupied
      setRooms((prev) =>
        prev.map((r) => (r.number === targetBooking.roomNumber ? { ...r, status: 'Occupied', cleaningStatus: 'Clean' } : r))
      );
    } else if (status === 'Checked Out') {
      // Mark room available AND DIRTY (for housekeeping loop!)
      setRooms((prev) =>
        prev.map((r) =>
          r.number === targetBooking.roomNumber ? { ...r, status: 'Available', cleaningStatus: 'Dirty' } : r
        )
      );
    } else if (status === 'Canceled') {
      // Release room status
      setRooms((prev) =>
        prev.map((r) => (r.number === targetBooking.roomNumber ? { ...r, status: 'Available' } : r))
      );
    }
  };

  // GUEST MANAGEMENT
  const handleAddGuest = (newGuest: Omit<GuestProfile, 'id' | 'totalBookings'>) => {
    const guest: GuestProfile = {
      ...newGuest,
      id: `g-${Date.now()}`,
      totalBookings: 0,
    };
    setGuests((prev) => [...prev, guest]);
  };

  const handleUpdateGuest = (id: string, updatedFields: Partial<GuestProfile>) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updatedFields } : g))
    );
  };

  // USER MANAGEMENT (ADMIN)
  const handleAddUser = (newUserFields: Omit<User, 'id'>) => {
    const user: User = {
      ...newUserFields,
      id: `u-${Date.now()}`,
    };
    setUsers((prev) => [...prev, user]);
  };

  const handleUpdateUserRole = (id: string, role: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role } : u))
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // HOUSEKEEPING STATUSES & REPAIRS
  const handleUpdateCleaningStatus = (roomId: string, cleaningStatus: Room['cleaningStatus']) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, cleaningStatus } : r))
    );
  };

  const handleAddMaintenanceRequest = (newIssue: Omit<MaintenanceRequest, 'id' | 'reportedAt'>) => {
    const request: MaintenanceRequest = {
      ...newIssue,
      id: `mr-${Date.now()}`,
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setMaintenance((prev) => [request, ...prev]);

    // Append issues list into the Room model
    setRooms((prev) =>
      prev.map((r) =>
        r.number === newIssue.roomNumber
          ? { ...r, maintenanceIssues: [...r.maintenanceIssues, newIssue.description], status: 'Out of Order' }
          : r
      )
    );
  };

  const handleResolveMaintenance = (id: string) => {
    const target = maintenance.find((m) => m.id === id);
    if (!target) return;

    // Remove request
    setMaintenance((prev) => prev.filter((m) => m.id !== id));

    // Resolve room issues
    setRooms((prev) =>
      prev.map((r) =>
        r.number === target.roomNumber
          ? {
            ...r,
            maintenanceIssues: r.maintenanceIssues.filter((issue) => issue !== target.description),
            status: r.status === 'Out of Order' ? 'Available' : r.status,
          }
          : r
      )
    );
  };

  // Quick guest booking helper (fired from the Guest Portal catalog explore page)
  const handleQuickBookRoomGuestPortal = (roomType: string, totalDays: number) => {
    if (!currentUser) return;

    // Dynamic dates checkin today, checkout today + days
    const today = new Date();
    const checkout = new Date();
    checkout.setDate(today.getDate() + totalDays);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    const typeObj = ROOM_TYPES.find((t) => t.name === roomType);
    const cost = (typeObj ? typeObj.price : 150) * totalDays;

    // Find available room
    const matchingAvailableRoom = rooms.find((r) => r.type === roomType && r.status === 'Available');
    const roomNo = matchingAvailableRoom ? matchingAvailableRoom.number : `${Math.floor(Math.random() * 100) + 104}`;

    handleAddBooking({
      guestName: currentUser.name,
      guestEmail: currentUser.email,
      roomNumber: roomNo,
      roomType: roomType,
      checkInDate: formatDate(today),
      checkOutDate: formatDate(checkout),
      status: 'Confirmed',
      totalAmount: cost,
      notes: `Quick booked ${totalDays} Nights stay via Coastal Escape guest portal.`,
    });
  };

  // 4. Render Layouts & Enforce RBAC
  if (!currentUser) {
    return <LoginView allUsers={users} onLoginSuccess={handleLoginSuccess} />;
  }

  // Double check RBAC constraints. If user navigates manually to unauthorized tabs, lock or redirect
  const tabRights: Record<Role, string[]> = {
    Admin: ['dashboard', 'rooms', 'reservations', 'guests', 'reports', 'housekeeping', 'users'],
    Manager: ['dashboard', 'rooms', 'reservations', 'reports'],
    Receptionist: ['dashboard', 'rooms', 'reservations', 'guests'],
    Housekeeping: ['housekeeping'],
    Guest: ['guestportal', 'reservations'],
  };

  const currentRoleRights = tabRights[currentUser.role];
  const isTabAuthorized = currentRoleRights.includes(activeTab);

  // Fallback trigger if tab is blocked for current user role
  const resolvedTab = isTabAuthorized ? activeTab : currentRoleRights[0];

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Responsive Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeTab={resolvedTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentUser={currentUser}
          allUsers={users}
          onLogout={handleLogout}
          onSwitchUser={handleSwitchUser}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Content canvas container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {resolvedTab === 'dashboard' && (
            <DashboardView
              rooms={rooms}
              bookings={bookings}
              guests={guests}
              maintenanceRequests={maintenance}
              currentUser={currentUser}
              onNavigate={(tab: any) => setActiveTab(tab)}
            />
          )}

          {resolvedTab === 'rooms' && (
            <RoomsView
              rooms={rooms}
              currentUser={currentUser}
              onAddRoom={handleAddRoom}
              onEditRoom={handleEditRoom}
              onDeleteRoom={handleDeleteRoom}
            />
          )}

          {resolvedTab === 'reservations' && (
            <ReservationsView
              bookings={bookings}
              rooms={rooms}
              currentUser={currentUser}
              onAddBooking={handleAddBooking}
              onUpdateBookingStatus={handleUpdateBookingStatus}
            />
          )}

          {resolvedTab === 'guests' && (
            <GuestsView
              guests={guests}
              currentUser={currentUser}
              onAddGuest={handleAddGuest}
              onUpdateGuest={handleUpdateGuest}
            />
          )}

          {resolvedTab === 'reports' && (
            <ReportsView
              bookings={bookings}
              rooms={rooms}
              guests={guests}
              maintenanceRequests={maintenance}
            />
          )}

          {resolvedTab === 'housekeeping' && (
            <HousekeepingView
              rooms={rooms}
              maintenanceRequests={maintenance}
              currentUser={currentUser}
              onUpdateCleaningStatus={handleUpdateCleaningStatus}
              onAddMaintenanceRequest={handleAddMaintenanceRequest}
              onResolveMaintenance={handleResolveMaintenance}
            />
          )}

          {resolvedTab === 'users' && (
            <UsersView
              users={users}
              currentUser={currentUser}
              onAddUser={handleAddUser}
              onUpdateUserRole={handleUpdateUserRole}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {resolvedTab === 'guestportal' && (
            <GuestPortalView
              rooms={rooms}
              bookings={bookings}
              currentUser={currentUser}
              onNavigateToReservations={() => setActiveTab('reservations')}
              onQuickBookRoom={handleQuickBookRoomGuestPortal}
            />
          )}
        </main>
      </div>
    </div>
  );
}
