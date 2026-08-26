"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";

const SIDEBAR_WIDTH = 240;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Students", icon: <PeopleIcon />, path: "/students" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        backgroundColor: "#1a1a2e",
        display: "flex",
        flexDirection: "column",
        pt: "64px",
        zIndex: 1200,
      }}
    >
      <Box sx={{ px: 3, py: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "#ffffff60", textTransform: "uppercase", letterSpacing: 1 }}
        >
          Main Menu
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#ffffff20" }} />

      <List sx={{ px: 1, mt: 1 }}>
        {navItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path === "/students" && pathname.startsWith("/students"));

          return (
            <ListItemButton
              key={item.path}
              onClick={() => router.push(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: isActive ? "#fff" : "#ffffff90",
                backgroundColor: isActive ? "#ffffff20" : "transparent",
                "&:hover": {
                  backgroundColor: "#ffffff15",
                  color: "#fff",
                },
                transition: "all 0.2s",
                position: "relative",
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "#42a5f5" : "#ffffff60",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                }}
              />
              {isActive && (
                <Box
                  sx={{
                    width: 4,
                    height: 32,
                    backgroundColor: "#42a5f5",
                    borderRadius: 2,
                    position: "absolute",
                    right: 0,
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}