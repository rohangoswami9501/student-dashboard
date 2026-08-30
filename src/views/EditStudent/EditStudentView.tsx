"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Typography, Alert, Button } from "@mui/material";
import StudentForm from "@/components/StudentForm/StudentForm";
import { studentService } from "@/services/studentService";
import { Student } from "@/types/student";
import Loading from "@/components/Loading/Loading";

export default function EditStudentView() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [student, setStudent] = useState<Student | null>(null);
  const [existingEmails, setExistingEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [found, all] = await Promise.all([
          studentService.getStudentById(id),
          studentService.getStudents(),
        ]);
        if (!found) {
          setError("Student not found");
          return;
        }
        setStudent(found);
        setExistingEmails(all.map((s) => s.email.toLowerCase()));
      } catch {
        setError("Failed to load student");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loading message="Loading student..." />;

  if (error)
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Edit Student
      </Typography>
      <StudentForm
        existingStudent={student!}
        existingEmails={existingEmails}
      />
    </Box>
  );
}