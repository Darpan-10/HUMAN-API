import { API_BASE_URL } from "./config";

export interface ConnectionResult {
  name: string;
  tag: string;
  reason: string;
}

export async function findConnections(intent: string): Promise<ConnectionResult[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${API_BASE_URL}/intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intent }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Unexpected response format");
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
}
