import { CustomError } from './AppError';

export class NotFoundError extends CustomError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
    this.name = 'NotFoundError';
    Error.captureStackTrace(this, this.constructor);
  }
}
