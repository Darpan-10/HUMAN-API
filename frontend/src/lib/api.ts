import { API_BASE_URL } from "./config";

export interface ConnectionResult {
  name: string;
  tag: string;
  reason: string;
  email?: string;
  expertise?: { skill: string; level: number }[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  skills: string[];
  interests: string[];
  bio?: string;
  availability: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: User;
}

// Helper function to handle API errors
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.detail || `API Error: ${response.status}`);
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error(`API Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
}

// Auth API
export async function registerUser(credentials: {
  email: string;
  password: string;
  name: string;
  skills: string[];
  interests: string[];
  bio?: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await handleApiResponse<AuthResponse>(response);
  return data.data;
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await handleApiResponse<AuthResponse>(response);
  return data.data;
}

export async function updateProfile(
  userId: string,
  updates: {
    name?: string;
    skills?: string[];
    interests?: string[];
    bio?: string;
    availability?: string;
  }
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  const data = await handleApiResponse<AuthResponse>(response);
  return data.data;
}

// Intent API
export async function findConnections(
  intent: string
): Promise<ConnectionResult[]> {
  const response = await fetch(`${API_BASE_URL}/intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent }),
  });

  return handleApiResponse<ConnectionResult[]>(response);
}
