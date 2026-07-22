import { Request, Response } from 'express';
import crypto from 'crypto';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { AuthRequest } from '../middleware/auth';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess } from '../utils/response';
import { logger } from '../utils/logger';
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

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    // Save Session with the Refresh Token (expires in 7 days)
    const session = new Session({
      userId: user._id,
      token: refreshToken,
      deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      ipAddress: req.ip || '127.0.0.1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await session.save();

    // Fire Notification
    NotificationService.send({
      userId: user._id.toString(),
      type: NotificationType.WELCOME,
      channels: [NotificationChannel.IN_APP, NotificationChannel.EMAIL],
      title: "Welcome to Slice of Swadesh",
      message: "We're glad to have you! Explore our delicious menu.",
      metadata: {},
      emailTemplate: "welcome"
    }).catch(err => logger.error("Welcome notification failed", { error: err.message }));

    // Set Access Token Cookie (15 mins)
    res.cookie('swadesh-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 mins
      path: '/'
    });

    // Set Refresh Token Cookie (7 days)
    res.cookie('swadesh-refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    return sendSuccess(
      res,
      "User registered successfully",
      {
        token: accessToken,
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

    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRefreshToken(user._id.toString(), user.role);

    const session = new Session({
      userId: user._id,
      token: refreshToken,
      deviceInfo: req.headers['user-agent'] || 'Unknown Device',
      ipAddress: req.ip || '127.0.0.1',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
    await session.save();

    // Set Access Token Cookie (15 mins)
    res.cookie('swadesh-token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 mins
      path: '/'
    });

    // Set Refresh Token Cookie (7 days)
    res.cookie('swadesh-refresh', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    return sendSuccess(
      res,
      "Logged in successfully",
      {
        token: accessToken,
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
    
    const refreshToken = req.cookies?.['swadesh-refresh'];
    if (refreshToken) {
      await Session.findOneAndDelete({ token: refreshToken });
    }

    res.clearCookie('swadesh-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    res.clearCookie('swadesh-refresh', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

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

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash and set on user record
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    NotificationService.send({
      userId: user._id.toString(),
      type: NotificationType.PASSWORD_RESET,
      channels: [NotificationChannel.EMAIL], // Usually just email
      title: "Password Reset Request",
      message: "You requested a password reset.",
      metadata: { resetUrl },
      emailTemplate: "forgotPassword"
    }).catch(err => logger.error("Password reset notification failed", { error: err.message }));

    return sendSuccess(res, 'If your email is registered, a password reset link has been sent.');
  } catch (error) {
    return handleError(res, error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      throw new ValidationError('Token and password are required');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ValidationError('Password reset token is invalid or has expired');
    }

    // Set new password (pre-save hook will hash it automatically)
    user.passwordHash = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return sendSuccess(res, 'Password has been reset successfully');
  } catch (error) {
    return handleError(res, error);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const rToken = req.cookies?.['swadesh-refresh'];
    if (!rToken) {
      throw new UnauthorizedError('No refresh token provided');
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(rToken);
    } catch (err) {
      res.clearCookie('swadesh-token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
      res.clearCookie('swadesh-refresh', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const session = await Session.findOne({ token: rToken, isValid: true });
    if (!session) {
      // Invalidate all active sessions for this user (Reuse attack defense)
      await Session.deleteMany({ userId: decoded.id });
      res.clearCookie('swadesh-token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
      res.clearCookie('swadesh-refresh', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
      throw new UnauthorizedError('Session invalid or reuse detected. Logging out of all devices.');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.id, decoded.role);
    const newRefreshToken = generateRefreshToken(decoded.id, decoded.role);

    // Rotate token in the Session model
    session.token = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await session.save();

    // Set new cookies
    res.cookie('swadesh-token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 mins
      path: '/'
    });

    res.cookie('swadesh-refresh', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    return sendSuccess(res, 'Token refreshed successfully', { token: newAccessToken });
  } catch (error) {
    return handleError(res, error);
  }
};
