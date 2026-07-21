import app from './app';
import { connectDB } from './config/db';
import 'dotenv/config';
import http from 'http';
import { RealtimeService } from './modules/realtime/services/realtime.service';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSockets
RealtimeService.initialize(server);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      logger.info(`Slice of Swadesh backend running on port ${PORT}`, { service: 'server', port: PORT });
    });
  })
  .catch((err) => {
    logger.error('Failed to connect to MongoDB', { service: 'server', error: err.message });
    process.exit(1);
  });
