import { logger } from './logger.js';

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delaysMs = [500, 1500]
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) {
        throw err;
      }
      const delay = delaysMs[attempt] || 1500;
      logger.warn(`Retry attempt ${attempt + 1}/${retries} failed. Waiting ${delay}ms before retrying...`);
      await new Promise((res) => setTimeout(res, delay));
      attempt++;
    }
  }
}
