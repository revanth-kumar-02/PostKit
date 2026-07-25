import type { AppErrorDetails, ErrorSeverity, ErrorHandlerCallback } from '@/types/errors';
import { logger } from './logger';

export class AppError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly originalError?: unknown;

  constructor(code: string, message: string, severity: ErrorSeverity = 'error', originalError?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.originalError = originalError;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public toDetails(): AppErrorDetails {
    return {
      code: this.code,
      message: this.message,
      severity: this.severity,
      originalError: this.originalError,
      timestamp: new Date().toISOString(),
    };
  }
}

class CentralErrorHandler {
  private listeners: ErrorHandlerCallback[] = [];

  public subscribe(callback: ErrorHandlerCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public handle(error: unknown, fallbackCode = 'ERR_UNKNOWN'): AppErrorDetails {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = new AppError(fallbackCode, error.message, 'error', error);
    } else {
      appError = new AppError(fallbackCode, String(error), 'error', error);
    }

    const details = appError.toDetails();
    logger.error(`[${details.code}] ${details.message}`, details.originalError || '');

    this.listeners.forEach((listener) => {
      try {
        listener(details);
      } catch (err) {
        logger.error('Error in error-handler listener:', err);
      }
    });

    return details;
  }
}

export const errorHandler = new CentralErrorHandler();
