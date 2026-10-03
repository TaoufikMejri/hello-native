const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export class ApiError extends Error {
  errors: string[];

  constructor(errors: string[]) {
    super(errors.join(', '));
    this.errors = errors;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data.errors ?? ['Something went wrong']);
  }
  return data as T;
}

export function signup(params: { name: string; email: string; password: string }) {
  return postJson<AuthResponse>('/signup', params);
}

export function login(params: { email: string; password: string }) {
  return postJson<AuthResponse>('/login', params);
}
