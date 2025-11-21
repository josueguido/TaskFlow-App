import { app } from './app.js';
import { logger } from './utils/logger';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'production'
    ? './config/DB/.env.production'
    : './config/DB/.env.dev'
});

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});
