import { AppError } from './errorHandler';
import { logger } from './logger';

export interface HttpRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  signal?: AbortSignal;
}

export async function httpClient<T>(
  url: string,
  options: HttpRequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeoutMs = 30000,
    signal,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onExternalAbort);
    }
  }

  try {
    logger.debug(`HTTP Request: ${method} ${url}`);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener('abort', onExternalAbort);

    if (!response.ok) {
      if (response.status === 401) {
        throw new AppError('ERR_UNAUTHORIZED', 'Invalid or unauthorized API key.', 'error');
      }
      if (response.status === 429) {
        throw new AppError('ERR_RATE_LIMIT', 'Rate limit exceeded. Please try again in a few moments.', 'warning');
      }
      if (response.status >= 500) {
        throw new AppError('ERR_SERVER', 'AI service unavailable. Please try again shortly.', 'error');
      }

      const errorText = await response.text().catch(() => '');
      throw new AppError(
        'ERR_HTTP',
        `API request failed with status ${response.status}.`,
        'error',
        errorText
      );
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (signal) signal.removeEventListener('abort', onExternalAbort);

    if (error instanceof AppError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      if (signal?.aborted) {
        throw new AppError('ERR_ABORTED', 'Request was cancelled by user.', 'info');
      }
      throw new AppError('ERR_TIMEOUT', 'Request timed out. Please check your network connection.', 'warning');
    }

    if (error instanceof TypeError) {
      throw new AppError('ERR_NETWORK', 'Network connection error. Please check your connection.', 'error', error);
    }

    throw new AppError('ERR_UNKNOWN', 'An unexpected error occurred during API request.', 'error', error);
  }
}
