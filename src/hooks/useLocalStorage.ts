import { useCallback, useState } from 'react';

type UseLocalStorageReturn = readonly [
  storedValue: string,
  setStoredValue: (value: string) => void,
];

export function useLocalStorage(
  key: string,
  initialValue = ''
): UseLocalStorageReturn {
  const [storedValue, setStoredValueState] = useState<string>(
    () => localStorage.getItem(key) ?? initialValue
  );

  const setStoredValue = useCallback(
    (value: string) => {
      setStoredValueState(value);
      localStorage.setItem(key, value);
    },
    [key]
  );

  return [storedValue, setStoredValue] as const;
}
