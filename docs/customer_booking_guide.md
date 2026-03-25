# Table Reservation System — Customer Booking Guide

Welcome to the Table Reservation System. This guide explains how guests and standard users make reservations online and the rules governing table availability.

## 1. Booking a Table (Unauthenticated Guests)

You do not need an account to book a table at our restaurants. You can make a booking directly through the public website.
- **Selecting a Time**: You must choose a date, time, and party size.
- **Availability Check**: The system automatically checks the restaurant's active floor plan. If your party size is 4, it will only display times where a table matching your capacity is free. If the party is too large, the system will prevent the booking.
- **Guest Details**: During checkout, you are required to provide your First Name, Email, and optionally a Phone Number and Special Requests.

## 2. Real-Time Concurrency

Our system ensures that double-booking does not occur.
- When you click "Confirm Booking", the system acquires an atomic lock on that specific table for the duration of your stay.
- If another user attempts to book the exact same table at the exact same millisecond, the system resolves the conflict fairly by granting the table to the first request processed.

## 3. Conflict Resolution & Cancellation Rules

**Important Note on Overbooking:**
As a standard guest without a Member account, your reservation is unauthenticated. 
- In extremely rare, high-demand scenarios, the restaurant operates a **Premium Priority** rule.
- If a VIP/Premium Member requests an immediate booking and no other tables are available, the system may automatically bump an unauthenticated guest reservation to accommodate the Premium Member.
- If your reservation is cancelled due to priority overrides, you will be notified, and the status of your booking will change to `Cancelled` with a reason.

To protect your reservation from being overridden, we highly recommend registering as a **Common Member** or upgrading to a **Premium Member**.
