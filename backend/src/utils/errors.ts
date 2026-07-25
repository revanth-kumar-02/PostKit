export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class LLMTimeoutError extends AppError {
  constructor(message = 'AI generation timed out.') {
    super(message, 504, 'LLM_TIMEOUT');
    this.name = 'LLMTimeoutError';
  }
}

export class LLMProviderError extends AppError {
  constructor(message = 'AI provider failure.', statusCode = 502) {
    super(message, statusCode, 'LLM_PROVIDER_ERROR');
    this.name = 'LLMProviderError';
  }
}
