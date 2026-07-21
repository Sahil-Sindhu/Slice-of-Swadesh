# API Documentation

The Slice of Swadesh backend exposes a RESTful API under `/api/v1`.

## Authentication

All protected routes require a JWT token passed in the `Authorization` header as a Bearer token.
```
Authorization: Bearer <token>
```

## Core Modules

### Auth
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user profile

### Menu (Food & Categories)
- `GET /api/v1/foods` - List all food items
- `GET /api/v1/foods/:slug` - Get food details by slug
- `POST /api/v1/foods` - Create food item (Admin)
- `GET /api/v1/categories` - List all categories

### Orders
- `POST /api/v1/orders` - Create a new order
- `GET /api/v1/orders` - Get orders (supports filters, pagination)
- `GET /api/v1/orders/:id` - Get specific order details
- `PATCH /api/v1/orders/:id/status` - Update order status (Admin/Kitchen)

### Cart & Checkout
- `GET /api/v1/cart` - Get current user's cart
- `POST /api/v1/cart/items` - Add item to cart
- `POST /api/v1/checkout/process` - Process order checkout

### Payments
- `POST /api/v1/payments/verify` - Verify a payment transaction
- `POST /api/v1/payments/refund` - Refund a captured payment (Admin)

### Inventory
- `GET /api/v1/inventory` - Get inventory items
- `POST /api/v1/inventory/transactions` - Log inventory movement

## WebSockets
Connect to the Socket.IO server at the root domain (`/`).
Send the JWT token in `auth.token` during connection to join role-specific rooms automatically.
