"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box, Typography, Paper, Chip, Button,
  Grid, Divider, Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { studentService } from "@/services/studentService";
import { Student } from "@/types/student";
import Loading from "@/components/Loading/Loading";

const statusColor = (status: string) => {
  if (status === "Active") return "success";
  if (status === "Completed") return "primary";
  return "default";
};

export default function StudentDetailsView() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentService
      .getStudentById(id)
      .then((s) => {
        if (!s) setError("Student not found");
        else setStudent(s);
      })
      .catch(() => setError("Failed to load student"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading message="Loading student..." />;

  if (error || !student)
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button onClick={() => router.back()}>Go Back</Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );

  const fields: [string, string][] = [
    ["Full Name", `${student.firstName} ${student.lastName}`],
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            variant="outlined"
          >
            Back
          </Button>
          <Typography variant="h5" fontWeight="bold">
            Student Details
          </Typography>
        </Box>
        <Button
          startIcon={<EditIcon />}
          variant="contained"
          onClick={() => router.push(`/students/${id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, maxWidth: 700 }}>
        {/* Name + Status */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {student.firstName} {student.lastName}
          </Typography>
          <Chip
            label={student.status}
            color={
              statusColor(student.status) as "success" | "primary" | "default"
            }
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {fields.map(([label, value]) => (
            <Grid item xs={12} sm={6} key={label}>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
              <Typography fontWeight="medium">{value}</Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}