"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box, Typography, Paper, Grid, Chip,
  Button, Divider, Avatar, Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { studentService } from "@/services/studentService";
import { Student } from "@/types/student";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading/Loading";

const statusColor = (status: string) => {
  if (status === "Active") return "success";
  if (status === "Completed") return "primary";
  return "default";
};

export default function StudentProfileView() {
  const { user } = useAppContext();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.studentId) return;
    studentService
      .getStudentById(user.studentId)
      .then((s) => {
        if (!s) setError("Profile not found");
        else setStudent(s);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loading message="Loading profile..." />;

  if (error || !student)
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  const fields: [string, string][] = [
    ["Email", student.email],
    ["Phone", student.phone],
    ["Date of Birth", student.dateOfBirth],
    ["Course", student.course],
    ["Batch", student.batch],
    ["Start Date", student.startDate],
    ["Trainer", student.trainer],
    ["Experience", student.experience],
    ["Score", `${student.score}%`],
    ["Pending Assignments", String(student.pendingAssignments)],
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          My Profile
        </Typography>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => router.push("/profile/edit")}
        >
          Edit Profile
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, maxWidth: 700 }}>
        {/* Avatar + Name + Status */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
          <Avatar
            sx={{
              width: 72, height: 72,
              backgroundColor: "#1976d2",
              fontSize: 28,
            }}
          >
            {student.firstName[0]}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {student.firstName} {student.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {student.course} • {student.batch}
            </Typography>
          </Box>
          <Chip
            label={student.status}
            color={statusColor(student.status) as "success" | "primary" | "default"}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Fields */}
        <Grid container spacing={2}>
          {fields.map(([label, value]) => (
            <Grid size={{ xs: 12, sm: 6 }} key={label}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography sx={{ fontWeight: "medium" }}>{value}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}