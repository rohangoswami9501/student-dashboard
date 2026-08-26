"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Grid, Typography, Button, Alert } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import StarIcon from "@mui/icons-material/Star";
import { useStudents } from "@/hooks/useStudents";
import Loading from "@/components/Loading/Loading";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 2,
        borderLeft: `5px solid ${color}`,
      }}
    >
      <Box
        sx={{
          backgroundColor: `${color}20`,
          borderRadius: "50%",
          p: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </Box>
    </Box>
  );
}

export default function DashboardView() {
  const router = useRouter();
  const { students, loading, error, loadStudents } = useStudents();

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "Active").length;
    const completed = students.filter((s) => s.status === "Completed").length;
    const avgScore =
      total > 0
        ? Math.round(
            students.reduce((sum, s) => sum + Number(s.score), 0) / total
          )
        : 0;
    const pendingAssignments = students.reduce(
      (sum, s) => sum + Number(s.pendingAssignments),
      0
    );
    return { total, active, completed, avgScore, pendingAssignments };
  }, [students]);

  if (loading) return <Loading message="Loading dashboard..." />;

  if (error)
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadStudents}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, Admin 👋
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => router.push("/students/add")}
        >
          + Add Student
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Total Students"
            value={stats.total}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Active Students"
            value={stats.active}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<SchoolIcon />}
            color="#9c27b0"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Average Score"
            value={`${stats.avgScore}%`}
            icon={<StarIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Pending Assignments"
            value={stats.pendingAssignments}
            icon={<AssignmentLateIcon />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>
    </Box>
  );
}