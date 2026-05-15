import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use = (req: Request, res: Response, next: NextFunction) => {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || 'unknown';
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const timestamp = new Date().toISOString();

      const message = `${timestamp} | ${method} ${originalUrl} ${statusCode} - ${duration}ms | ${ip} | ${userAgent}`;

      if (statusCode >= 500) {
        this.logger.error(message);
      } else if (statusCode >= 400) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  };
}
