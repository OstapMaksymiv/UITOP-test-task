import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Global error filter that normalizes EVERY error into the consistent
 * shape required by the spec: { error: string }.
 *
 * - HttpExceptions (incl. validation errors from ValidationPipe) keep their
 *   status code. Their payload can be a string, or an object whose `message`
 *   is a string or an array (class-validator) — all flattened to one string.
 * - Anything else becomes a 500 with a generic message (details are logged,
 *   never leaked to the client).
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        error = payload;
      } else if (payload && typeof payload === 'object') {
        const message = (payload as { message?: unknown }).message;
        if (Array.isArray(message)) {
          // class-validator returns an array of messages — join into one string.
          error = message.join('; ');
        } else if (typeof message === 'string') {
          error = message;
        } else {
          error = exception.message;
        }
      }
    } else if (exception instanceof Error) {
      // Unexpected error: log the stack server-side, return a generic message.
      this.logger.error(exception.message, exception.stack);
    }

    response.status(status).json({ error });
  }
}
