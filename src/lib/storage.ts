import { hasStorageSupport } from '@/config/chrome.config';
import type { StorageKey, StorageSchema } from '@/types/storage';
import { logger } from './logger';

class StorageAdapter {
  public async get<K extends StorageKey>(key: K): Promise<StorageSchema[K] | undefined> {
    if (hasStorageSupport()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          resolve(result[key] as StorageSchema[K]);
        });
      });
    }

    try {
      const raw = localStorage.getItem(`postkit:${key}`);
      return raw ? (JSON.parse(raw) as StorageSchema[K]) : undefined;
    } catch {
      logger.warn(`Failed to read key "${key}" from localStorage fallback.`);
      return undefined;
    }
  }

  public async set<K extends StorageKey>(key: K, value: StorageSchema[K]): Promise<void> {
    if (hasStorageSupport()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => resolve());
      });
    }

    try {
      localStorage.setItem(`postkit:${key}`, JSON.stringify(value));
    } catch {
      logger.warn(`Failed to write key "${key}" to localStorage fallback.`);
    }
  }

  public async remove<K extends StorageKey>(key: K): Promise<void> {
    if (hasStorageSupport()) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([key], () => resolve());
      });
    }

    localStorage.removeItem(`postkit:${key}`);
  }

  public async clear(): Promise<void> {
    if (hasStorageSupport()) {
      return new Promise((resolve) => {
        chrome.storage.local.clear(() => resolve());
      });
    }

    localStorage.clear();
  }
}

export const storage = new StorageAdapter();
