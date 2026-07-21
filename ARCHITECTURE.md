# Architecture Overview

Slice of Swadesh follows a modular, monolithic architecture with clear separation of concerns.

## System Components

1.  **Frontend (Next.js Application)**
    *   **Features:** Divided by domain (Admin, Kitchen, Employee, Customer).
    *   **State:** Uses `zustand` for global state (Auth, Cart) and `react-query` for server state.
    *   **Styling:** Custom Design System built on Tailwind CSS.

2.  **Backend (Express API)**
    *   **Controllers:** Handle HTTP requests and responses.
    *   **Services:** Contain business logic.
    *   **Models:** Mongoose schemas defining database structure.
    *   **Modules:** Encapsulated features like `payment`, `notification`, `invoice`, and `cache`.

3.  **Database (MongoDB)**
    *   Stores core entities: Users, Orders, Inventory, Foods, Categories.
    *   Heavily indexed for performance on dashboard queries.

4.  **Cache (Redis)**
    *   Uses the Cache-Aside pattern via `CacheService`.
    *   Reduces database load for frequently accessed data (e.g., active menu items).
    *   Gracefully falls back to in-memory caching if Redis is unavailable.

5.  **Real-Time Engine (Socket.IO)**
    *   Secured via JWT authentication.
    *   Role-based rooms (e.g., `admin`, `kitchen`, `customer:{id}`).
    *   Synchronized with frontend React Query cache for instant UI updates.

## Abstraction Patterns

The backend strictly adheres to Provider/Service abstractions to remain flexible:

*   **PaymentService -> PaymentGateway:** Abstracted to support Mock, Razorpay, or Stripe.
*   **NotificationService -> Provider:** Abstracted to support Nodemailer or external services (SendGrid).
*   **InvoiceService -> Generator:** Abstracted to support HTML-to-PDF via Puppeteer, or cloud generation.
*   **CacheService -> CacheProvider:** Abstracted to support Redis or Memory.
