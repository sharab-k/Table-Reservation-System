# Table Reservation System — Staff Guide

Welcome to the **Staff Guide**. This document is for restaurant employees (`MANAGER`, `HOST`, `VIEWER`) who operate the point-of-sale (POS) terminal and manage daily operations.

## 1. Getting Access

- You will receive an email invitation from your Restaurant Admin.
- Click the secure link to set your password.
- Log in via the Staff Portal using your email and password. Your access is strictly limited to your designated restaurant.

## 2. The Calendar & Table View

Upon logging in, you will see the **Calendar View** for the current day.
- **Sections**: The view is divided into your restaurant's Floor Areas (e.g., Main Dining, Patio).
- **Reservations**: Each table lists all upcoming reservations for the day in chronological order.

## 3. Managing Reservations (For Hosts & Managers)

As a `HOST` or `MANAGER`, your primary job is managing the flow of guests and updating reservation statuses in real-time.

**Valid Status Workflow:**
1. **Pending/Confirmed**: The initial state when a guest books online.
2. **Arriving**: Update the status to `Arriving` when the guest checks in at the podium.
3. **Seated**: Update to `Seated` once you walk them to their specific table.
4. **Completed**: Update to `Completed` when the guest pays the bill and leaves. *This triggers an automatic update to the customer's visit history profile.*

**Cancellations & No-Shows:**
- If a guest calls to cancel, update the status to `Cancelled` and provide a reason.
- If a guest is more than 15 minutes late and unresponsive, mark them as `No-Show`. This frees up the table in the system for walk-ins or Premium Members.

## 4. Walk-Ins

- You can manually create reservations for Walk-In guests via the dashboard. 
- You can assign them specifically to an empty table. The atomic transaction engine ensures you won't accidentally double-book a table that someone is simultaneously booking online.
