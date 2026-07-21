import { Request, Response } from 'express';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { AuthRequest } from '../middleware/auth';
import { generateToken } from '../utils/jwt';
import { sendSuccess } from '../utils/response';
import { handleError } from '../utils/errorHandler';
import { ValidationError } from '../errors/ValidationError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { NotFoundError } from '../errors/NotFoundError';
import { NotificationService } from '../modules/notification/services/notification.service';
import { NotificationType, NotificationChannel } from '../modules/notification/constants/notification';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email }).select("-__v").lean();
    if (existingUser) {
      throw new ValidationError('Email address already registered');
    }

    const user = new User({
      email,
      passwordHash: password,
      name,
      role: 'customer',
      phoneNumber,
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    // Save Session
    const session = new Session({
      userId: user._id,
      token,
      deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      ipAddress: req.ip || '127.0.0.1',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });
    await session.save();

    // Fire Notification
    NotificationService.send({
      userId: user._id.toString(),
      type: NotificationType.WELCOME,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      title: "Welcome to Slice of Swadesh",
      message: "We're glad to have you! Here's a ₹150 welcome coupon.",
      metadata: { couponCode: "WELCOME150" },
      emailTemplate: "welcome"
    }).catch(err => console.error("Notification failed", err));

    return sendSuccess(
      res,
      "User registered successfully",
      {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          loyaltyPoints: user.loyaltyPoints,
        },
      },
      201
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("-__v");
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken(user._id.toString(), user.role);

    const session = new Session({
      userId: user._id,
      token,
      deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      ipAddress: req.ip || '127.0.0.1',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await session.save();

    return sendSuccess(
      res,
      "Logged in successfully",
      {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          phoneNumber: user.phoneNumber,
          loyaltyPoints: user.loyaltyPoints,
        },
      }
    );
  } catch (error) {
    return handleError(res, error);
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) throw new UnauthorizedError('Not authenticated');
    
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      await Session.findOneAndDelete({ token });
    }

    return sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) throw new UnauthorizedError('Not authenticated');
    const user = await User.findById(req.user._id).select('-passwordHash -__v').lean();
    return sendSuccess(res, 'Profile retrieved successfully', { user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) throw new UnauthorizedError('Not authenticated');

    const { name, phoneNumber, avatar } = req.body;
    const user = await User.findById(req.user._id).select("-__v");
    if (!user) throw new NotFoundError('User not found');

    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (avatar) user.avatar = avatar;

    await user.save();
    return sendSuccess(res, 'Profile updated successfully', { user });
  } catch (error) {
    return handleError(res, error);
  }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) throw new UnauthorizedError('Not authenticated');

    const { label, street, city, zipCode, isDefault } = req.body;
    const user = await User.findById(req.user._id).select("-__v");
    if (!user) throw new NotFoundError('User not found');

    if (isDefault) {
      user.addresses.forEach(addr => { addr.isDefault = false; });
    }

    user.addresses.push({ label, street, city, zipCode, isDefault: isDefault || false });
    await user.save();

    return sendSuccess(res, 'Address added successfully', { addresses: user.addresses });
  } catch (error) {
    return handleError(res, error);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-__v");
    if (!user) {
      // Don't leak user existence
      return sendSuccess(res, 'If your email is registered, a password reset link has been sent.');
    }

    // Mock reset token
    const resetToken = "mock_reset_token_123";
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    NotificationService.send({
      userId: user._id.toString(),
      type: NotificationType.PASSWORD_RESET,
      channels: [NotificationChannel.EMAIL], // Usually just email
      title: "Password Reset Request",
      message: "You requested a password reset.",
      metadata: { resetUrl },
      emailTemplate: "forgotPassword"
    }).catch(err => console.error("Notification failed", err));

    return sendSuccess(res, 'If your email is registered, a password reset link has been sent.');
  } catch (error) {
    return handleError(res, error);
  }
};
