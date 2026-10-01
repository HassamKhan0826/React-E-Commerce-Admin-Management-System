import { useEffect, useState } from "react";

export function getStoredValue(key, defaultValue) {
  try {
    const rawValue = localStorage.getItem(key);

    if (rawValue === null) {
      return defaultValue;
    }

    try {
      return JSON.parse(rawValue);
    } catch {
      return rawValue;
    }
  } catch {
    return defaultValue;
  }
}

export function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or blocked (private mode). The app keeps working.
  }
}

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => getStoredValue(key, defaultValue));

  useEffect(() => {
    setStoredValue(key, value);
  }, [key, value]);

  return [value, setValue];
}