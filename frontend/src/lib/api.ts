import { API_BASE_URL } from "./config";

export interface ConnectionResult {
  name: string;
  tag: string;
  reason: string;
}

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
