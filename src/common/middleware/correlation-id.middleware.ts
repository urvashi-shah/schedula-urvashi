import {
    Injectable,
    NestMiddleware,
  } from '@nestjs/common';
  import { v4 as uuidv4 } from 'uuid';
  
  @Injectable()
  export class CorrelationIdMiddleware
    implements NestMiddleware
  {
    use(req: any, res: any, next: () => void) {
        req.correlationId = uuidv4();
      
        console.log(
            `CID: [${req.correlationId}] ${req.method} ${req.originalUrl}`,
          );
      
        next();
      }
  }