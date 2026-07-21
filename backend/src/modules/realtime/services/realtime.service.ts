import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "../middleware/socketAuth";
import { SocketEvent } from "../constants/events";

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
        console.log(`[Socket] User connected: ${socket.id}`);

        socket.on("disconnect", () => {
          console.log(`[Socket] User disconnected: ${socket.id}`);
        });
      });
    }
  }

  static emitToRoom(room: string, event: SocketEvent, payload: any) {
    if (this.io) {
      this.io.to(room).emit(event, payload);
    } else {
      console.warn("[RealtimeService] Cannot emit: Socket.IO is not initialized.");
    }
  }

  static emitToAll(event: SocketEvent, payload: any) {
    if (this.io) {
      this.io.emit(event, payload);
    }
  }
}
