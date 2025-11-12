// User types for simple authentication
export interface User {
  id: string | number;
  username: string;
  email: string;
}

export interface SignupRequest {
  username: string;
  email: string;
}

export interface SignupResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  email: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
}
