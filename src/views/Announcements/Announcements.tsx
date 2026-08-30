"use client";

import { useState, useEffect } from "react";
import {
  Box, Typography, Paper, Button, TextField,
  Chip, IconButton, Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CampaignIcon from "@mui/icons-material/Campaign";
import { toast } from "react-toastify";

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

export default function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"Info" | "Warning" | "Success">("Info");

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    setAnnouncements(data ? JSON.parse(data) : []);
  }, []);

  const save = (updated: Announcement[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAnnouncements(updated);
  };

  const handleAdd = () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title aur message dono required hain!");
      return;
    }
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title,
      message,
      type,
      date: new Date().toLocaleDateString("en-IN"),
    };
    save([newAnnouncement, ...announcements]);
    setTitle("");
    setMessage("");
    setType("Info");
    setShowForm(false);
    toast.success("Announcement added!");
  };

  const handleDelete = (id: number) => {
    save(announcements.filter((a) => a.id !== id));
    toast.success("Announcement deleted!");
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CampaignIcon sx={{ color: "#1976d2", fontSize: 28 }} />
          <Box>
            <Typography variant="h5" fontWeight="bold">Announcements</Typography>
            <Typography variant="body2" color="text.secondary">
              Admin notice board
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowForm((prev) => !prev)}
        >
          {showForm ? "Cancel" : "New Announcement"}
        </Button>
      </Box>

      {/* Add Form */}
      {showForm && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Typography fontWeight="bold" mb={2}>New Announcement</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
            />
            <TextField
              fullWidth
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={3}
              size="small"
            />

            {/* Type Selector */}
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">Type:</Typography>
              {(["Info", "Warning", "Success"] as const).map((t) => (
                <Chip
                  key={t}
                  label={t}
                  color={typeColors[t]}
                  variant={type === t ? "filled" : "outlined"}
                  onClick={() => setType(t)}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>

            <Button variant="contained" onClick={handleAdd} sx={{ alignSelf: "flex-end" }}>
              Post Announcement
            </Button>
          </Box>
        </Paper>
      )}

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography color="text.secondary" mb={2}>
            No announcements yet.
          </Typography>
          <Button variant="contained" onClick={() => setShowForm(true)}>
            Add First Announcement
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {announcements.map((a) => (
            <Alert
              key={a.id}
              severity={typeColors[a.type]}
              sx={{ borderRadius: 2 }}
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => handleDelete(a.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography fontWeight="bold">{a.title}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  {a.date}
                </Typography>
              </Box>
              <Typography variant="body2" mt={0.5}>{a.message}</Typography>
            </Alert>
          ))}
        </Box>
      )}
    </Box>
  );
}