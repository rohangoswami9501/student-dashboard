"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import StudentForm from "@/components/StudentForm/StudentForm";
import { studentService } from "@/services/studentService";
import Loading from "@/components/Loading/Loading";

export default function AddStudentView() {
  const [existingEmails, setExistingEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getStudents().then((students) => {
      setExistingEmails(students.map((s) => s.email.toLowerCase()));
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading message="Loading..." />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Add New Student
      </Typography>
      <StudentForm existingEmails={existingEmails} />
    </Box>
  );
}