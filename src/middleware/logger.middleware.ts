import { Injectable, NestMiddleware } from '@nestjs/common';
import { ulid } from 'ulidx';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = ulid();
    if (!req.headers?.traceId) {
      req.headers.traceId = traceId;
      res.setHeader('traceId', traceId);
    }
    next();
  }
}

// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { ulid } from 'ulidx';
// import { FastifyRequest, FastifyReply } from 'fastify';

// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//   use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
//     const traceId = ulid();
//     if (!req.headers?.traceId) {
//       req.headers.traceId = traceId;
//       res.setHeader('traceId', traceId);
//     }
//     next();
//   }
// }
