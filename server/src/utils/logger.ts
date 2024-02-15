import winston from 'winston';

export const setupLogging = (app: any) => {
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });

  app.use((req: any, res: any, next: any) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
}; 