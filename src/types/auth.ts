export type UserRole = "admin" | "student";

export interface AuthUser {
  role: UserRole;
  name: string;
  email: string;
  studentId?: number;
}