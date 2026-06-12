import { Room, Booking, GuestProfile, User, MaintenanceRequest } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Alexandra Vance',
    email: 'admin@grandresort.com',
    role: 'Admin',
    phone: '+1 (555) 0192',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'u-2',
    name: 'Julian Sterling',
    email: 'manager@grandresort.com',
    role: 'Manager',
    phone: '+1 (555) 0143',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: 'u-3',
    name: 'Seraphina Finch',
    email: 'receptionist@grandresort.com',
    role: 'Receptionist',
    phone: '+1 (555) 0188',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
  },
  {
    id: 'u-4',
    name: 'Marcus Brody',
    email: 'housekeeper@grandresort.com',
    role: 'Housekeeping',
    phone: '+1 (555) 0122',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'u-5',
    name: 'Eleanor Carlyle',
    email: 'guest@grandresort.com',
    role: 'Guest',
    phone: '+1 (555) 0111',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'r-101',
    number: '101',
    type: 'Classic King Room',
    price: 180,
    status: 'Available',
    cleaningStatus: 'Clean',
    maintenanceIssues: [],
    floor: 1
  },
  {
    id: 'r-102',
    number: '102',
    type: 'Classic King Room',
    price: 180,
    status: 'Occupied',
    cleaningStatus: 'Clean',
    maintenanceIssues: [],
    floor: 1
  },
  {
    id: 'r-103',
    number: '103',
    type: 'Classic Double Twin',
    price: 150,
    status: 'Available',
    cleaningStatus: 'Dirty',
    maintenanceIssues: ['Lightbulb flickering in vanity area'],
    floor: 1
  },
  {
    id: 'r-201',
    number: '201',
    type: 'Grand Ocean Suite',
    price: 350,
    status: 'Occupied',
    cleaningStatus: 'Clean',
    maintenanceIssues: [],
    floor: 2
  },
  {
    id: 'r-202',
    number: '202',
    type: 'Grand Ocean Suite',
    price: 350,
    status: 'Available',
    cleaningStatus: 'Dirty',
    maintenanceIssues: [],
    floor: 2
  },
  {
    id: 'r-203',
    number: '203',
    type: 'Lakeside Executive Suite',
    price: 420,
    status: 'Available',
    cleaningStatus: 'In Progress',
    maintenanceIssues: [],
    floor: 2
  },
  {
    id: 'r-301',
    number: '301',
    type: 'Royal Imperial Penthouse',
    price: 850,
    status: 'Available',
    cleaningStatus: 'Clean',
    maintenanceIssues: [],
    floor: 3
  },
  {
    id: 'r-302',
    number: '302',
    type: 'Royal Imperial Penthouse',
    price: 850,
    status: 'Out of Order',
    cleaningStatus: 'Dirty',
    maintenanceIssues: ['AC controller replacement needed'],
    floor: 3
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-001',
    guestName: 'Eleanor Carlyle',
    guestEmail: 'guest@grandresort.com',
    roomNumber: '102',
    roomType: 'Classic King Room',
    checkInDate: '2026-06-10',
    checkOutDate: '2026-06-15',
    status: 'Checked In',
    totalAmount: 900,
    notes: 'Requested extra pillows and high room priority'
  },
  {
    id: 'b-002',
    guestName: 'Jameson Thorne',
    guestEmail: 'jameson.thorne@example.com',
    roomNumber: '201',
    roomType: 'Grand Ocean Suite',
    checkInDate: '2026-06-08',
    checkOutDate: '2026-06-12',
    status: 'Checked In',
    totalAmount: 1400,
    notes: 'Anniversary celebration package'
  },
  {
    id: 'b-003',
    guestName: 'Beatrix Potter',
    guestEmail: 'beatrix@books.com',
    roomNumber: '203',
    roomType: 'Lakeside Executive Suite',
    checkInDate: '2026-06-15',
    checkOutDate: '2026-06-18',
    status: 'Confirmed',
    totalAmount: 1260,
    notes: 'Prefers tea-making facilities refreshed daily'
  },
  {
    id: 'b-004',
    guestName: 'Clara Oswald',
    guestEmail: 'clara.oswald@time.org',
    roomNumber: '101',
    roomType: 'Classic King Room',
    checkInDate: '2026-06-01',
    checkOutDate: '2026-06-05',
    status: 'Checked Out',
    totalAmount: 720,
    notes: 'Check-out completed, express check-out setup.'
  },
  {
    id: 'b-005',
    guestName: 'Lord George Byron',
    guestEmail: 'poetry.lord@milord.com',
    roomNumber: '301',
    roomType: 'Royal Imperial Penthouse',
    checkInDate: '2026-06-25',
    checkOutDate: '2026-07-01',
    status: 'Confirmed',
    totalAmount: 5100,
    notes: 'VIP Guest. VIP butler arrangements requested.'
  }
];

export const INITIAL_GUESTS: GuestProfile[] = [
  {
    id: 'g-1',
    name: 'Eleanor Carlyle',
    email: 'guest@grandresort.com',
    phone: '+1 (555) 0111',
    idProof: 'PP-882910',
    vipStatus: true,
    totalBookings: 4,
    notes: 'Prefers lavender scent and quiet corner suits.'
  },
  {
    id: 'g-2',
    name: 'Jameson Thorne',
    email: 'jameson.thorne@example.com',
    phone: '+1 (555) 0148',
    idProof: 'DL-XY78192',
    vipStatus: false,
    totalBookings: 1,
    notes: 'Allergic to feathers.'
  },
  {
    id: 'g-3',
    name: 'Beatrix Potter',
    email: 'beatrix@books.com',
    phone: '+1 (555) 0200',
    idProof: 'PP-104928',
    vipStatus: true,
    totalBookings: 12,
    notes: 'Frequent visitor, loves private balcony rooms.'
  },
  {
    id: 'g-4',
    name: 'Lord George Byron',
    email: 'poetry.lord@milord.com',
    phone: '+1 (555) 0001',
    idProof: 'PP-ROYAL01',
    vipStatus: true,
    totalBookings: 2,
    notes: 'Limo airport transfers. Exceptional high tier support.'
  }
];

export const INITIAL_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: 'mr-1',
    roomNumber: '103',
    description: 'Lightbulb flickering in vanity area',
    reportedAt: '2026-06-10 14:30',
    status: 'Pending',
    severity: 'Mild'
  },
  {
    id: 'mr-2',
    roomNumber: '302',
    description: 'AC controller replacement needed',
    reportedAt: '2026-06-09 09:12',
    status: 'In Progress',
    severity: 'Critical'
  }
];

export const ROOM_TYPES = [
  { name: 'Classic Double Twin', price: 150, capacity: 2, description: 'Elegant bedroom with twin beds and marble bathroom.' },
  { name: 'Classic King Room', price: 180, capacity: 2, description: 'Luxurious king bed overlooking the estate gardens.' },
  { name: 'Grand Ocean Suite', price: 350, capacity: 3, description: 'Stunning floor-to-ceiling vistas of the pristine bay with bespoke lounge space.' },
  { name: 'Lakeside Executive Suite', price: 420, capacity: 4, description: 'Spacious retreat with dining parlour, fireplace, and waterside porch.' },
  { name: 'Royal Imperial Penthouse', price: 850, capacity: 6, description: 'The absolute pinnacle of luxury. Private elevator, infinity patio, and full butler pantry.' }
];
