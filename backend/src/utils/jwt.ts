import jwt from 'jsonwebtoken';
import crypto from 'crypto';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing!');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || JWT_SECRET;

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (userId: string, role: string): string => {
  const jti = crypto.randomBytes(16).toString('hex');
  return jwt.sign({ id: userId, role, jti }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const generateToken = (userId: string, role: string): string => {
  return generateAccessToken(userId, role);
};

export const verifyToken = (token: string): { id: string; role: string } => {
  return jwt.verify(token, JWT_SECRET) as { id: string; role: string };
};

export const verifyRefreshToken = (token: string): { id: string; role: string } => {
  return jwt.verify(token, JWT_REFRESH_SECRET) as { id: string; role: string };
};
