export enum UserRole {
  ADMIN = "ADMIN",
  GOVERNMENT_OFFICER = "GOVERNMENT_OFFICER",
  MINISTRY_OFFICIAL = "MINISTRY_OFFICIAL",
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}