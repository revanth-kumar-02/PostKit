import { logger } from '@/lib/logger';
import { isLinkedInPage } from '@/lib/utils/browser';

/**
 * PostKit V2 Content Script
 * Injected on https://www.linkedin.com/*
 * Serves as the DOM interface between the Side Panel and LinkedIn's editor interface.
 */

if (isLinkedInPage()) {
  logger.info('PostKit V2 Content Script loaded on LinkedIn page.');
}
