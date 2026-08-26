"use client";
import { useRouter } from "next/navigation";
import { Box, Toolbar } from "@mui/material";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";

const SIDEBAR_WIDTH = 240;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("admin");
    router.replace("/");
  };
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: `${SIDEBAR_WIDTH}px`,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <Header onLogout={handleLogout} />
        <Toolbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}