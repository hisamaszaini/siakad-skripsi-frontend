import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  showToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: unknown | null;
}

export function useApi<TArgs extends unknown[], TResponse>(
  apiFn: (...args: TArgs) => Promise<TResponse>,
  options?: UseApiOptions<TResponse>
) {
  const [state, setState] = useState<UseApiState<TResponse>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs) => {
      setState({ data: null, isLoading: true, error: null });

      try {
        const response = await apiFn(...args);
        setState({ data: response, isLoading: false, error: null });

        if (options?.showToast !== false && options?.successMessage) {
          toast.success(options.successMessage);
        }

        options?.onSuccess?.(response);
        return response;
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } } };
        const errorMsg =
          err.response?.data?.message ||
          options?.errorMessage ||
          "Terjadi kesalahan";
        
        setState({ data: null, isLoading: false, error });
        
        if (options?.showToast !== false) {
          toast.error(errorMsg);
        }

        options?.onError?.(error);
        throw error;
      }
    },
    [apiFn, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useMutation<TArgs extends unknown[], TResponse>(
  apiFn: (...args: TArgs) => Promise<TResponse>,
  options?: UseApiOptions<TResponse>
) {
  return useApi(apiFn, options);
}
