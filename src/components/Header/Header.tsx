"use client";

import { useRouter } from "next/navigation";
import {
  AppBar, Toolbar, Typography,
  Button, Switch, Tooltip, Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAppContext } from "@/context/AppContext";

export default function Header() {
  const router = useRouter();
  const { darkMode, toggleDarkMode, logout } = useAppContext();

  return (
    <AppBar position="fixed" elevation={1} sx={{ zIndex: 1201 }}>
      <Toolbar>
        <SchoolIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", flexGrow: 1, cursor: "pointer" }}
          onClick={() => router.push("/dashboard")}
        >
          EduAdmin
        </Typography>

        {/* Dark Mode Toggle */}
        <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <LightModeIcon sx={{ fontSize: 18, opacity: darkMode ? 0.5 : 1 }} />
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              color="default"
              size="small"
            />
            <DarkModeIcon sx={{ fontSize: 18, opacity: darkMode ? 1 : 0.5 }} />
          </Box>
        </Tooltip>

        {/* Logout */}
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}