import { APIError } from '../types/api';

export function createAPIError(error: any): APIError {
  // Handle OpenAI API specific errors
  if (error.error?.message) {
    return {
      message: error.error.message,
      code: error.error.code || error.code,
      status: error.status || 500
    };
  }

  // Handle network or other errors
  if (error.message) {
    return {
      message: error.message,
      code: error.code,
      status: error.status || 500
    };
  }

  // Default error
  return {
    message: 'An unexpected error occurred',
    status: 500
  };
}