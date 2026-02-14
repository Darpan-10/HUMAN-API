// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production (deployed), use relative path to route through same domain
  if (import.meta.env.PROD) {
    return "/api";
  }

  // In development, use localhost
  return "http://127.0.0.1:8000";
};

export const API_BASE_URL = getApiBaseUrl();
