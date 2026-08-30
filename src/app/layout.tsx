"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider, createTheme, CssBaseline, Box, Toolbar } from "@mui/material";
import { AppProvider, useAppContext } from "@/context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import StudentSidebar from "@/components/Sidebar/StudentSidebar";
import AuthGuard from "@/components/AuthGuard/AuthGuard";

const SIDEBAR_WIDTH = 240;

function AppShell({ children }: { children: React.ReactNode }) {
  const { darkMode, user } = useAppContext();
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: { main: "#1976d2" },
          background: {
            default: darkMode ? "#121212" : "#f5f7fa",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthGuard>
        {isLoginPage ? (
          <>{children}</>
        ) : (
          <Box sx={{ display: "flex", minHeight: "100vh" }}>
            {user?.role === "student" ? <StudentSidebar /> : <Sidebar />}
            <Box
              sx={{
                flexGrow: 1,
                ml: `${SIDEBAR_WIDTH}px`,
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Header />
              <Toolbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
            </Box>
          </Box>
        )}
      </AuthGuard>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}