# Slice of Swadesh

Slice of Swadesh is a premium modern restaurant management system designed for a fusion restaurant serving Indian-inspired pizzas and craft burgers.

![Slice of Swadesh](/frontend/public/images/logo.png)

## Overview

This project is a fully-featured, production-ready Enterprise Resource Planning (ERP) application. It manages everything from customer orders and payments to kitchen operations, employee shifts, and inventory management.

## Features

- **Customer Ordering Portal:** Beautiful, responsive UI for customers to browse the menu, customize orders, and checkout.
- **Admin Dashboard:** Comprehensive analytics, user management, and configuration.
- **Kitchen Display System (KDS):** Real-time order tracking and status updates for the kitchen staff.
- **Employee Portal:** Shift management and basic operational controls.
- **Inventory & Recipe Engine:** Tracks raw ingredients and deducts them automatically based on recipe configurations when orders are placed.
- **Real-Time Notifications:** WebSockets powered updates for live order tracking.
- **Automated Invoicing:** Generates PDF invoices and sends them via email.
- **Payment Abstraction:** Supports mock payments, pay-at-counter, and is architected to integrate with Razorpay.

## Technology Stack

### Frontend
- Next.js (App Router)
- React 18
- Tailwind CSS
- Zustand (State Management)
- TanStack Query (Data Fetching)
- Socket.IO Client

### Backend
- Node.js & Express
- TypeScript
- MongoDB (Mongoose)
- Redis (Cache)
- Socket.IO (WebSockets)
- Puppeteer (PDF Generation)
- Nodemailer (Emails)

## Getting Started

Please see `DEPLOYMENT.md` for instructions on deploying the application to production, and `ARCHITECTURE.md` for a technical overview of the system.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
