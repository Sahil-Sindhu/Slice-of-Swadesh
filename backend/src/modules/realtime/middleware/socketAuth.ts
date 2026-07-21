import { Socket } from "socket.io";
import { verifyToken } from "../../../utils/jwt";
import { User } from "../../../models/User";

export const socketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("role _id").lean();
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    // Attach user to socket
    (socket as any).user = user;

    // Join rooms based on role
    if (user.role === 'admin' || user.role === 'manager') {
      socket.join('admin');
      socket.join(`employee:${user._id.toString()}`);
    } else if (user.role === 'chef') {
      socket.join('kitchen');
      socket.join(`employee:${user._id.toString()}`);
    } else {
      socket.join(`customer:${user._id.toString()}`);
    }

    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
};
