const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface DiscretizeRequest {
  state: [number, number, number, number];
  n_bins?: number;
}

export interface DiscretizeResponse {
  success: boolean;
  discretized: number[];
  state_shape: number[];
  original_state?: number[];
  error?: string;
}

export interface HealthResponse {
  status: string;
  message: string;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/api`);
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return response.json();
}

export async function discretize(
  request: DiscretizeRequest
): Promise<DiscretizeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/discretize`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Discretization failed");
  }

  return data;
}

export async function discretizeGet(
  position: number,
  velocity: number,
  angle: number,
  angularVelocity: number,
  nBins: number = 20
): Promise<DiscretizeResponse> {
  const params = new URLSearchParams({
    position: position.toString(),
    velocity: velocity.toString(),
    angle: angle.toString(),
    angular_velocity: angularVelocity.toString(),
    n_bins: nBins.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/api/discretize?${params}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Discretization failed");
  }

  return data;
}
