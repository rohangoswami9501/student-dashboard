"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthUser } from "@/types/auth";

const ADMIN_ROUTES = ["/dashboard", "/students", "/announcements"];
const STUDENT_ROUTES = ["/profile", "/student-announcements"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    const user: AuthUser | null = stored ? JSON.parse(stored) : null;
    const isLoginPage = pathname === "/";

    // Not logged in
    if (!user && !isLoginPage) {
      window.location.href = "/";
      return;
    }
    // Already logged in — login page pe aaya
    if (user && isLoginPage) {
      window.location.href = user.role === "admin" ? "/dashboard" : "/profile";
      return;
    }

    if (user) {
      const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
      const isStudentRoute = STUDENT_ROUTES.some((r) => pathname.startsWith(r));

      // Student admin route pe aaya
      if (user.role === "student" && isAdminRoute) {
        window.location.href = "/profile";
        return;
      }

      // Admin student route pe aaya
      if (user.role === "admin" && isStudentRoute) {
        window.location.href = "/dashboard";
        return;
      }
    }

    setAuthorized(true);
  }, [pathname]);

  if (!authorized) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}