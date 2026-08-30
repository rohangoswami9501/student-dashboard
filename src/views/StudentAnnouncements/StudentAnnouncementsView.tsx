"use client";
import { useState, useEffect } from "react";
import {
  Box, Typography, Alert,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";

interface Announcement {
  id: number;
  title: string;
  message: string;
  type: "Info" | "Warning" | "Success";
  date: string;
}

const STORAGE_KEY = "announcements";

const typeColors: Record<string, "info" | "warning" | "success"> = {
  Info: "info",
  Warning: "warning",
  Success: "success",
};

export default function StudentAnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    setAnnouncements(data ? JSON.parse(data) : []);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <CampaignIcon sx={{ color: "#1976d2", fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Announcements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Latest updates from admin
          </Typography>
        </Box>
      </Box>

      {announcements.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary">
            No announcements yet.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {announcements.map((a) => (
            <Alert
              key={a.id}
              severity={typeColors[a.type]}
              sx={{ borderRadius: 2 }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "bold" }}>{a.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  {a.date}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mt: 0.5 }}>{a.message}</Typography>
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );
}