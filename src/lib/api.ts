// API configuration and utilities
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: "/oakcollectionsadmin/auth/log-in",
  LOGOUT: "/auth/logout",
  VERIFY_TOKEN: "/auth/verify",
  REFRESH_TOKEN: "/auth/refresh",

  // User endpoints
  USERS: "/users",
  USER_PROFILE: "/users/profile",

  // Dashboard endpoints
  DASHBOARD_STATS: "/dashboard/stats",

  // Add your other endpoints here
};

// Helper function to build full URLs
export const buildApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`;
};

// Helper function for query parameters
export const buildUrlWithParams = (
  endpoint: string,
  params: Record<string, string | number>
): string => {
  const url = buildApiUrl(endpoint);
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });

  return `${url}?${searchParams.toString()}`;
};
