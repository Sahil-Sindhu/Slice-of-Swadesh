import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import mongoSanitize from 'express-mongo-sanitize';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import orderRoutes from './routes/orderRoutes';
import categoryRoutes from './routes/categoryRoutes';
import foodRoutes from './routes/foodRoutes';
import variantRoutes from './routes/variantRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import inventoryTransactionRoutes from './routes/inventoryTransactionRoutes';
import recipeRoutes from './routes/recipeRoutes';
import cartRoutes from './routes/cartRoutes';
import checkoutRoutes from './routes/checkoutRoutes';
import paymentRoutes from './modules/payment/routes/payment.routes';
import notificationRoutes from './modules/notification/routes/notification.routes';
import invoiceRoutes from './modules/invoice/routes/invoice.routes';
import reviewRoutes from './routes/reviewRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 'error',
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/auth/forgot-password', authLimiter);
app.use('/api/v1/auth/reset-password', authLimiter);

// Request Parsing & Compression
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(compression());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/foods', foodRoutes);
app.use('/api/v1/variants', variantRoutes);
app.use('/api/v1/ingredients', ingredientRoutes);
app.use('/api/v1/inventory', inventoryRoutes);
app.use('/api/v1', inventoryTransactionRoutes);
app.use('/api/v1/recipes', recipeRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/cart', checkoutRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Temporary test email route
app.post('/api/v1/test/email', async (req: Request, res: Response) => {
  try {
    const { NodemailerProvider } = require('./modules/notification/providers/NodemailerProvider');
    const provider = new NodemailerProvider();
    
    const template = req.body.template || 'welcome';
    const to = req.body.to || 'supportsliceofswadesh@gmail.com';
    const subject = req.body.subject || `Test ${template} Email from Slice of Swadesh`;
    const context = req.body.context || {
      name: 'Test User',
      orderId: 'ORD-99999',
      amount: '500',
      totalAmount: '500',
      resetUrl: 'http://localhost:3000/reset-password?token=mocktoken'
    };
    
    await provider.sendEmail({
      to,
      subject,
      template,
      context
    });
    res.status(200).json({ success: true, message: `Email (${template}) dispatched successfully` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Basic Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    database: dbStatus,
    redis: process.env.REDIS_URL ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    version: '2.0.0'
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

export default app;
