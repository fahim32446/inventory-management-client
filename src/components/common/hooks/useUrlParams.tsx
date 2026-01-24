import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseUrlParamsReturn {
  getUrlParam: (key: string) => string | null;
  setUrlParam: (key: string, value: string | null) => void;
  removeUrlParam: (key: string) => void;
  removeAllUrlParams: () => void;
  setUrlParamsFromObject: (params: Record<string, string | null>) => void;
  getAllUrlParams: () => Record<string, string>;
}

const useUrlParams = (): UseUrlParamsReturn => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getUrlParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  const setUrlParam = useCallback(
    (key: string, value: string | null): void => {
      const newParams = new URLSearchParams(searchParams);
      if (
        value === null ||
        value === 'undefined' ||
        value === undefined ||
        value === ''
      ) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const removeUrlParam = useCallback(
    (key: string): void => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(key);
      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const removeAllUrlParams = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const setUrlParamsFromObject = useCallback(
    (params: Record<string, string | null>): void => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
        if (
          value === null ||
          value === 'undefined' ||
          value === undefined ||
          value === ''
        ) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const getAllUrlParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'current' && key !== 'pageSize') {
        params[key] = value;
      }
    });
    return params;
  }, [searchParams]);

  return {
    getUrlParam,
    setUrlParam,
    removeUrlParam,
    removeAllUrlParams,
    setUrlParamsFromObject,
    getAllUrlParams,
  };
};

export default useUrlParams;
