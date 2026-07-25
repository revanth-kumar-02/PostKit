import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';
import type { StorageKey, StorageSchema } from '@/types/storage';
import { logger } from '@/lib/logger';

export function useStorage<K extends StorageKey>(
  key: K,
  defaultValue?: StorageSchema[K]
): [StorageSchema[K] | undefined, (value: StorageSchema[K]) => Promise<void>, boolean] {
  const [value, setValue] = useState<StorageSchema[K] | undefined>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    storage
      .get(key)
      .then((stored) => {
        if (isMounted) {
          setValue(stored !== undefined ? stored : defaultValue);
          setLoading(false);
        }
      })
      .catch((err) => {
        logger.error(`Error loading storage key "${key}":`, err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [key, defaultValue]);

  const updateValue = useCallback(
    async (newValue: StorageSchema[K]) => {
      setValue(newValue);
      await storage.set(key, newValue);
    },
    [key]
  );

  return [value, updateValue, loading];
}
