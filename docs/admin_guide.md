# Table Reservation System — Admin Guide

Welcome to the **Admin Guide** for the Table Reservation System. This system is designed as a multi-tenant SaaS platform, meaning as a Super Admin or Restaurant Owner (Admin), you have full control over your organization's configuration, floor plans, and staff.

## 1. System Overview

The application utilizes strict **Role-Based Access Control (RBAC)**.
- **SUPER_ADMIN**: Manages the entire SaaS platform (can create new organizations/restaurants).
- **ADMIN**: The restaurant owner. Has full control over a single organization `orgId`.

## 2. Managing Your Restaurant (Organization)

As an Admin, your account is tied directly to your Organization (Restaurant).
- **Organization Settings**: You can configure your restaurant's operating hours, `default_reservation_duration_min` (e.g., 90 minutes), and `max_party_size`. These rules dictate what your guests can book online.

## 3. Floor Plan & Table Management

The system allows you to dynamically import and manage your physical restaurant layout.
- **CSV Table Import**: You can upload a CSV file containing your tables via the **Staff Dashboard**. 
  - **Required Columns:** `Table, Capacity, Area, Type` (e.g., `T1, 4, Main Dining, Indoor`).
  - The system automatically provisions "Floor Areas" and calculates your restaurant's maximum capacity based on active tables.
- **Table Status**: You can mark tables as inactive if they are under maintenance. Inactive tables are immediately removed from the availability calculation for guests.

## 4. Managing Staff & Invitations

Admins are responsible for inviting staff to the system.
- **Inviting Staff**: You can send an email invitation to a new employee and assign them a specific role (`MANAGER`, `HOST`, `VIEWER`).
- **Accepting Invites**: The staff member will receive a secure token to set their password and active their account.
- **Staff Roles**:
  - `MANAGER`: Can edit restaurant settings, floor plans, and manage lower-tier staff.
  - `HOST`: Front-of-house staff. Can create, edit, and update the status of reservations.
  - `VIEWER`: Read-only access to the calendar (e.g., kitchen staff).

## 5. Security & Isolation

- **Multi-tenant Isolation**: Rest assured that your customer data, tables, and reservations are strictly isolated via backend policies. Staff assigned to your restaurant cannot access data from any other restaurant on the platform.
