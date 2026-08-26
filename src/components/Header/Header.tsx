"use client";

import { useRouter } from "next/navigation";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const router = useRouter();
  return (
    <AppBar position="fixed" elevation={1} sx={{ zIndex: 1201 }}>
      <Toolbar>
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => router.push("/dashboard")}
        >
          EduAdmin
        </Typography>
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}