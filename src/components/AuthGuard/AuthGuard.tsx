"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    const isLoginPage = pathname === "/";

    if (!admin && !isLoginPage) {
      router.replace("/");
    } else if (admin && isLoginPage) {
      router.replace("/dashboard");
    } else {
      setChecking(false); 
    }
  }, [pathname]);
  if (checking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return <>{children}</>;
}