import { useAuth } from "@/contexts/AuthContext";
import { useCallback } from "react";
import { API_CONFIG, buildApiUrl } from "@/lib/api";

interface ApiOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
  timeout?: number;
}

export const useApi = () => {
  const { token, logout } = useAuth();

  const apiCall = useCallback(
    async <T = unknown>(
      endpoint: string,
      options: ApiOptions = {}
    ): Promise<T> => {
      const {
        timeout = API_CONFIG.TIMEOUT,
        headers = {},
        ...fetchOptions
      } = options;

      // Build full URL
      const url = buildApiUrl(endpoint);

      // Prepare headers
      const requestHeaders = {
        ...API_CONFIG.HEADERS,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      };

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...fetchOptions,
          headers: requestHeaders,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle authentication errors
        if (response.status === 401) {
          logout();
          throw new Error("Session expired. Please login again.");
        }

        // Handle other HTTP errors
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `HTTP Error: ${response.status} ${response.statusText}`
          );
        }

        // Return JSON response
        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof Error) {
          if (error.name === "AbortError") {
            throw new Error("Request timeout");
          }
          throw error;
        }

        throw new Error("An unexpected error occurred");
      }
    },
    [token, logout]
  );

  // Convenience methods
  const get = useCallback(
    <T = unknown>(endpoint: string, options?: Omit<ApiOptions, "method">) =>
      apiCall<T>(endpoint, { ...options, method: "GET" }),
    [apiCall]
  );

  const post = useCallback(
    <T = unknown>(
      endpoint: string,
      data?: unknown,
      options?: Omit<ApiOptions, "method" | "body">
    ) =>
      apiCall<T>(endpoint, {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      }),
    [apiCall]
  );

  const put = useCallback(
    <T = unknown>(
      endpoint: string,
      data?: unknown,
      options?: Omit<ApiOptions, "method" | "body">
    ) =>
      apiCall<T>(endpoint, {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      }),
    [apiCall]
  );

  const del = useCallback(
    <T = unknown>(endpoint: string, options?: Omit<ApiOptions, "method">) =>
      apiCall<T>(endpoint, { ...options, method: "DELETE" }),
    [apiCall]
  );

  return { apiCall, get, post, put, delete: del };
};
