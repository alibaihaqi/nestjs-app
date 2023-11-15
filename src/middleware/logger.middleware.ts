import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ulid } from 'ulidx';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const traceId = ulid();
    if (!req.headers?.traceId) {
      req.headers.traceId = traceId;
      res.setHeader('traceId', traceId);
    }
    next();
  }
}
