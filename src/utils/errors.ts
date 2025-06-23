export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  statusCode?: number;
  data?: any;
}

export class CustomError extends Error implements AppError {
  type: ErrorType;
  code?: string;
  statusCode?: number;
  data?: any;

  constructor(type: ErrorType, message: string, code?: string, statusCode?: number, data?: any) {
    super(message);
    this.type = type;
    this.code = code;
    this.statusCode = statusCode;
    this.data = data;
    this.name = 'CustomError';
  }

  static fromError(error: Error): CustomError {
    if (error instanceof CustomError) {
      return error;
    }

    // Network errors
    if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
      return new CustomError(ErrorType.NETWORK, 'Network connection failed. Please check your internet connection.');
    }

    // Auth errors
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return new CustomError(ErrorType.AUTH, 'Authentication failed. Please log in again.');
    }

    // Server errors
    if (error.message.includes('500') || error.message.includes('Internal Server Error')) {
      return new CustomError(ErrorType.SERVER, 'Server error. Please try again later.');
    }

    // Default to unknown error
    return new CustomError(ErrorType.UNKNOWN, error.message || 'An unexpected error occurred.');
  }
}

export const handleApiError = (error: any): CustomError => {
  if (error instanceof CustomError) {
    return error;
  }

  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new CustomError(ErrorType.VALIDATION, data.message || 'Invalid request data', 'BAD_REQUEST', status);
      case 401:
        return new CustomError(ErrorType.AUTH, 'Authentication required', 'UNAUTHORIZED', status);
      case 403:
        return new CustomError(ErrorType.AUTH, 'Access denied', 'FORBIDDEN', status);
      case 404:
        return new CustomError(ErrorType.VALIDATION, 'Resource not found', 'NOT_FOUND', status);
      case 429:
        return new CustomError(ErrorType.SERVER, 'Too many requests. Please try again later.', 'RATE_LIMIT', status);
      case 500:
        return new CustomError(ErrorType.SERVER, 'Internal server error', 'SERVER_ERROR', status);
      default:
        return new CustomError(ErrorType.UNKNOWN, data.message || 'An unexpected error occurred', 'UNKNOWN', status);
    }
  }

  return CustomError.fromError(error);
};
