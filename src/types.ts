export type Role = 'Admin' | 'Manager' | 'Receptionist' | 'Housekeeping' | 'Guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: 'Available' | 'Occupied' | 'Out of Order';
  cleaningStatus: 'Clean' | 'Dirty' | 'In Progress';
  maintenanceIssues: string[];
  floor: number;
}

export interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Canceled';
  totalAmount: number;
  notes?: string;
}

export interface GuestProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  idProof: string;
  vipStatus: boolean;
  totalBookings: number;
  notes?: string;
}

export interface MaintenanceRequest {
  id: string;
  roomNumber: string;
  description: string;
  reportedAt: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  severity: 'Mild' | 'Moderate' | 'Critical';
}
