# 🏨 Hotel Management System with Role-Based Access Control (RBAC)

## Overview

The Hotel Management System is a modern web application developed using **React, TypeScript, and Vite**. It helps hotels manage rooms, reservations, guests, housekeeping operations, reports, and user access through a secure **Role-Based Access Control (RBAC)** system.

The application provides different dashboards and functionalities depending on the logged-in user's role, ensuring secure and organized hotel operations.

---

# Project Features

## Authentication & Authorization

* User Login System
* Role-Based Access Control (RBAC)
* Dynamic Dashboard Access
* User Session Management
* Role-Specific Navigation Menus

### Supported Roles

| Role         | Description                              |
| ------------ | ---------------------------------------- |
| Admin        | Complete access to all modules           |
| Manager      | Access to reports and hotel statistics   |
| Receptionist | Reservation and guest management         |
| Housekeeping | Room cleaning and maintenance management |
| Guest        | Personal booking management              |

---

# Technology Stack

## Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Lucide React Icons
* Recharts

## Storage

* Browser Local Storage

No external database is required for demonstration purposes.

---

# System Architecture

```text
User Login
     |
     ▼
Role Verification
     |
     ▼
Role-Based Dashboard
     |
 ┌───┼─────────────┬──────────────┬─────────────┐
 ▼   ▼             ▼              ▼             ▼
Admin Manager Receptionist Housekeeping Guest
```

---

# Modules

## 1. Dashboard Module

Provides an overview of hotel operations.

### Statistics Displayed

* Total Rooms
* Available Rooms
* Occupied Rooms
* Total Bookings
* Revenue Summary
* Occupancy Status

### Features

* Quick overview cards
* Room occupancy information
* Booking statistics
* Revenue insights

---

## 2. Room Management Module

Used to manage hotel rooms.

### Features

* View all rooms
* Add new rooms
* Edit room details
* Delete rooms
* Update room status
* Manage room pricing

### Room Information

* Room Number
* Room Type
* Floor Number
* Price
* Occupancy Status
* Cleaning Status
* Maintenance Issues

### Room Status Types

* Available
* Occupied
* Out of Order

### Cleaning Status

* Clean
* Dirty
* In Progress

---

## 3. Reservation Management Module

Handles hotel bookings and reservations.

### Features

* Create reservation
* View reservation history
* Update booking details
* Cancel reservation
* Check booking status

### Booking Information

* Guest Name
* Guest Email
* Room Number
* Room Type
* Check-In Date
* Check-Out Date
* Total Amount
* Booking Notes

### Booking Status

* Confirmed
* Checked In
* Checked Out
* Canceled

---

## 4. Guest Management Module

Stores and manages guest information.

### Features

* View guest profiles
* Search guests
* Guest booking history
* VIP guest tracking

### Guest Information

* Name
* Email
* Phone Number
* ID Proof
* Total Bookings
* VIP Status

---

## 5. Housekeeping Module

Used by housekeeping staff to manage room cleaning activities.

### Features

* View assigned rooms
* Update cleaning status
* Track dirty rooms
* Monitor cleaning progress

### Cleaning States

* Clean
* Dirty
* In Progress

---

## 6. Maintenance Management Module

Tracks maintenance issues reported in rooms.

### Features

* Report maintenance issues
* Track maintenance requests
* Update repair status

### Maintenance Status

* Pending
* In Progress
* Resolved

### Severity Levels

* Mild
* Moderate
* Critical

---

## 7. Reports Module

Provides visual analytics for hotel management.

### Available Reports

* Revenue Analysis
* Occupancy Reports
* Booking Statistics
* Room Utilization Reports

### Charts

* Revenue Chart
* Occupancy Chart
* Booking Trend Chart

Built using Recharts.

---

## 8. User Management Module

Available to Admin users.

### Features

* View all users
* Manage user accounts
* Role assignment
* User switching for testing

### User Information

* Name
* Email
* Phone Number
* Assigned Role

---

# Role-Based Access Control (RBAC)

The application restricts functionality based on user role.

## Admin

Access:

* Dashboard
* Rooms
* Reservations
* Guests
* Reports
* Users
* Housekeeping

Permissions:

* Full CRUD operations
* User management
* Room management
* Report access

---

## Manager

Access:

* Dashboard
* Reservations
* Guests
* Reports

Permissions:

* View analytics
* Monitor occupancy
* Review bookings

---

## Receptionist

Access:

* Dashboard
* Reservations
* Guests

Permissions:

* Create bookings
* Manage guests
* Check-in guests
* Check-out guests

---

## Housekeeping

Access:

* Housekeeping Dashboard

Permissions:

* Update room cleaning status
* Report maintenance issues

---

## Guest

Access:

* Guest Portal

Permissions:

* View personal bookings
* View booking history
* Manage own reservations

---

# Local Storage Persistence

The application automatically stores data in browser Local Storage.

Stored Data:

* Users
* Rooms
* Bookings
* Guests
* Maintenance Requests
* Logged-in User

Benefits:

* No database setup required
* Data remains available after refresh
* Easy project demonstration

---

# Project Structure

```text
src/
│
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── DashboardView.tsx
│   ├── RoomsView.tsx
│   ├── ReservationsView.tsx
│   ├── GuestsView.tsx
│   ├── ReportsView.tsx
│   ├── UsersView.tsx
│   ├── HousekeepingView.tsx
│   ├── GuestPortalView.tsx
│   └── LoginView.tsx
│
├── data.ts
├── types.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

## Build Project

```bash
npm run build
```

---

# Sample Login Roles

The application includes demo users for testing.

| Role         | Email                                                               |
| ------------ | ------------------------------------------------------------------- |
| Admin        | [admin@grandresort.com](mailto:admin@grandresort.com)               |
| Manager      | [manager@grandresort.com](mailto:manager@grandresort.com)           |
| Receptionist | [receptionist@grandresort.com](mailto:receptionist@grandresort.com) |
| Housekeeping | [housekeeper@grandresort.com](mailto:housekeeper@grandresort.com)   |
| Guest        | [guest@grandresort.com](mailto:guest@grandresort.com)               |

Select the corresponding role during login.

---

# Future Enhancements

* Backend API Integration
* MySQL/PostgreSQL Database
* Online Payments
* Email Notifications
* SMS Notifications
* QR Check-In System
* Multi-Hotel Support
* AI-Based Occupancy Prediction
* Customer Feedback Analysis
* Inventory Management

---

# Learning Outcomes

This project demonstrates:

* React Component Architecture
* TypeScript Interfaces
* State Management
* CRUD Operations
* Local Storage Persistence
* Role-Based Access Control (RBAC)
* Dashboard Design
* Hotel Management Workflows
* Data Visualization Using Charts

---

# Conclusion

The Hotel Management System provides a complete solution for managing hotel operations while enforcing secure Role-Based Access Control. The project showcases modern frontend development practices and serves as an excellent academic, internship, or portfolio project.
