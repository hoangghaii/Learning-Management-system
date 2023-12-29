import { CustomError } from '@/utils/custom-error';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    const exceptionObj = exception.getResponse() as {
      error: string;
      message: string;
      statusCode: number;
    };

    let err = new CustomError(exceptionObj.message, exceptionObj.statusCode);

    // Duplicate key error
    if (status === 11000) {
      const message = `Duplicate entered`;
      err = new CustomError(message, 400);
    }

    if (exceptionObj.error === 'CastError') {
      const message = `Resource not found. Invalid: ${request.url}`;
      err = new CustomError(message, 400);
    }

    // Wrong JWT error
    if (exceptionObj.error === 'JsonWebTokenError') {
      const message = 'JSON Web Token is invalid. Try Again!!!';
      err = new CustomError(message, 400);
    }

    // JWT Expired error
    if (exceptionObj.error === 'TokenExpiredError') {
      const message = 'JSON Web Token is expired. Try Again!!!';
      err = new CustomError(message, 400);
    }

    response.status(err.statusCode).json({
      message: err.message,
      path: request.url,
      status: err.statusCode,
      success: false,
      timestamp: new Date().toISOString(),
    });
  }
}
