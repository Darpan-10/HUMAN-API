import { API_BASE_URL } from "./config";

export interface ConnectionResult {
  name: string;
  tag: string;
  reason: string;
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  const data: AuthResponse = await response.json();
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

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  const data: AuthResponse = await response.json();
  return data.data;
}

export async function updateProfile(userId: string, updates: {
  name?: string;
  skills?: string[];
  interests?: string[];
  bio?: string;
  availability?: string;
}): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Profile update failed");
  }

  const data: AuthResponse = await response.json();
  return data.data;
}

// Intent API
export async function findConnections(intent: string): Promise<ConnectionResult[]> {
  const response = await fetch(`${API_BASE_URL}/intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent }),
  });

  if (!response.ok) {
    throw new Error("Failed to find connections");
  }

  return response.json();
}
