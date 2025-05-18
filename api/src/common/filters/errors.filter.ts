import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ErrorsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const path = httpAdapter.getRequestUrl(request);

    const responseBody = {
      statusCode: httpStatus,
      message,
      path,
      method: httpAdapter.getRequestMethod(request),
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `Error: ${JSON.stringify(responseBody)}`,
      `Exception: ${exception}`,
      //   `Stack: ${exception instanceof Error ? exception.stack : ''}`,
    );

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
