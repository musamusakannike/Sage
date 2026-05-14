export type UserRole = 'hr_admin' | 'auditor';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  orgName: string;
  role: UserRole;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  orgId: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  sub: string;
  email: string;
  role: UserRole;
  orgId: string;
}
