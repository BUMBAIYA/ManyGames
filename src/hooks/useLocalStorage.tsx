import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useEventListener } from "./useEventListener";

type setValue<T> = Dispatch<SetStateAction<T>>;

declare global {
  interface WindowEventMap {
    "local-storage": CustomEvent;
  }
}

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, setValue<T>] {
  const readValue = useCallback((): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localstorage item with key ${key}:  `, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue: setValue<T> = useCallback(
    (value) => {
      try {
        const newValue = value instanceof Function ? value(storedValue) : value;
        localStorage.setItem(key, JSON.stringify(newValue));
        setStoredValue(newValue);
        window.dispatchEvent(new Event("local-storage"));
      } catch (error) {
        console.warn(
          `Error setting localstorage item with key: ${key}: `,
          error,
        );
      }
    },
    [storedValue],
  );

  useEffect(() => {
    setStoredValue(readValue);
  }, []);

  const handleStorageChange = useCallback(
    (event: StorageEvent | CustomEvent) => {
      if ((event as StorageEvent)?.key && (event as StorageEvent).key !== key) {
        return;
      }
      setStoredValue(readValue);
    },
    [key, readValue],
  );

  useEventListener("storage", handleStorageChange);

  useEventListener("local-storage", handleStorageChange);

  return [storedValue, setValue];
}
