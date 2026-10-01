import { useCallback, useEffect, useState } from "react";

const ERROR_MESSAGE = "Something went wrong. Please try again.";

export function useFetch(url) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState({
    requestKey: null,
    data: null,
    error: "",
  });

  const requestKey = url ? `${url}#${reloadCount}` : null;

  useEffect(() => {
    if (!url) {
      return undefined;
    }

    const controller = new AbortController();
    const key = `${url}#${reloadCount}`;

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setResult({ requestKey: key, data, error: "" });
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        setResult({ requestKey: key, data: null, error: ERROR_MESSAGE });
      });

    return () => controller.abort();
  }, [url, reloadCount]);

  const refetch = useCallback(() => {
    setReloadCount((count) => count + 1);
  }, []);

  const isCurrent = result.requestKey === requestKey;

  return {
    data: isCurrent ? result.data : null,
    loading: Boolean(url) && !isCurrent,
    error: isCurrent ? result.error : "",
    refetch,
  };
}