import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "../middleware/socketAuth";
import { SocketEvent } from "../constants/events";
import { logger } from "../../../utils/logger";

export class RealtimeService {
  private static io: SocketIOServer;

  static initialize(httpServer: HttpServer) {
    if (!this.io) {
      this.io = new SocketIOServer(httpServer, {
        cors: {
          origin: process.env.CORS_ORIGIN || "http://localhost:3000",
          credentials: true,
        },
      });

      this.io.use(socketAuthMiddleware);

      this.io.on("connection", (socket) => {
        logger.info(`User connected: ${socket.id}`, { service: 'socket' });

        socket.on("disconnect", () => {
          logger.info(`User disconnected: ${socket.id}`, { service: 'socket' });
        });
      });
    }
  }

  static emitToRoom(room: string, event: SocketEvent, payload: any) {
    if (this.io) {
      this.io.to(room).emit(event, payload);
    } else {
      logger.warn("Cannot emit: Socket.IO is not initialized.", { service: 'socket' });
    }
  }

  static emitToAll(event: SocketEvent, payload: any) {
    if (this.io) {
      this.io.emit(event, payload);
    }
  }
}
