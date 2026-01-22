import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BSONError } from 'bson';

@Catch(BSONError)
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: BSONError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: 'Invalid MongoDB ObjectId',
      error: 'Bad Request',
    });
  }
}
