# Slice Of Swadesh Backend

Production-ready Node.js, Express, TypeScript, and MongoDB backend supporting the Slice of Swadesh ERP ecosystem.

## Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Validation**: Zod DTO Schema Validation
- **Session Security**: JWT Authentication with Cookie support
- **Middlewares**: Helmet, CORS, Compression, Morgan (logging), Express Rate Limit

## Installation
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the `backend/` directory referencing `.env.example`:
```bash
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/swadesh?retryWrites=true&w=majority
JWT_SECRET=your_long_random_string_here
JWT_EXPIRES_IN=1d
```

## Run Project
- **Start Development Server** (with live reloading via ts-node-dev):
  ```bash
  npm run dev
  ```
- **Build Production JavaScript**:
  ```bash
  npm run build
  ```
- **Start Compiled Production Server**:
  ```bash
  npm start
  ```

## API Structure
All responses are formatted strictly in JSON structure:
- **Success Responses**:
  ```json
  {
    "success": true,
    "message": "Operation description",
    "data": { ... }
  }
  ```
- **Error Responses**:
  ```json
  {
    "success": false,
    "message": "Error description",
    "errors": [ ... ]
  }
  ```

## Folder Structure
```text
src/
├── config/         # Database connection settings
├── constants/      # Static parameters (e.g. order status transitions)
├── controllers/    # Express request controllers
├── dto/            # Zod validation schemas
├── errors/         # Custom AppError subclasses (NotFoundError, etc.)
├── middleware/     # Auth checks, validate schema middlewares
├── models/         # Mongoose schema models
├── routes/         # Express endpoint mappings
├── services/       # Core business workflows
├── utils/          # Standard utility helpers (JWT, error formatting)
├── app.ts          # Express app initializations
└── server.ts       # Database bootstrap and network listener
```

## Main Modules
1. **Authentication & User Management**: Registration, profile queries, role authentication.
2. **Catalog & Menu**: Category, food products, and food variants creation/retrievals.
3. **Ingredients & Recipes**: Ingredient registry and variant recipe definitions.
4. **Inventory System**: Inbound stock changes, real-time stock deduction, and log transactions.
5. **Carts & Checkout**: Persistent user cart state, SNAPSHOT pricing, and checkout orchestrator.
6. **Order Pipeline & Kitchen Dashboard**: Order placement, timeline logging, and live preparings.

## Future Work
- Integration with external payment gateways (Stripe & Razorpay)
- Live notifications using WebSockets for incoming orders
- Coupons and discount engine integrations
