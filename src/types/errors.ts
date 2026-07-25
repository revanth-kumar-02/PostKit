export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info';

export interface AppErrorDetails {
  code: string;
  message: string;
  severity: ErrorSeverity;
  originalError?: unknown;
  timestamp: string;
}

export type ErrorHandlerCallback = (error: AppErrorDetails) => void;
