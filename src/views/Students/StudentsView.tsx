"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useStudents } from "@/hooks/useStudents";
import StudentTable from "@/components/StudentTable/StudentTable";
import StudentFilters from "@/components/StudentFilters/StudentFilters";
import Loading from "@/components/Loading/Loading";
import { Student } from "@/types/student";
import { toast } from "react-toastify";

interface Filters {
  search: string;
  course: string;
  status: string;
  scoreRange: string;
}

export default function StudentsView() {
  const router = useRouter();
  const { students, loading, error, loadStudents, deleteStudent } = useStudents();

  const [activeFilters, setActiveFilters] = useState<Filters>({
    search: "",
    course: "",
    status: "",
    scoreRange: "",
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(activeFilters.search);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [activeFilters.search]);

  const courses = useMemo(
    () => [...new Set(students.map((s) => s.course))],
    [students]
  );

  const filteredStudents = useMemo(() => {
    return students.filter((s: Student) => {
      const matchSearch =
        !debouncedSearch ||
        s.firstName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.lastName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchCourse =
        !activeFilters.course || s.course === activeFilters.course;
      const matchStatus =
        !activeFilters.status || s.status === activeFilters.status;

      const matchScore = (() => {
        if (!activeFilters.scoreRange) return true;
        const [min, max] = activeFilters.scoreRange.split("-").map(Number);
        return s.score >= min && s.score <= max;
      })();

      return matchSearch && matchCourse && matchStatus && matchScore;
    });
  }, [students, debouncedSearch, activeFilters]);

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
      toast.success("Student deleted successfully!");
    } catch {
      toast.error("Failed to delete student.");
    }
  };

  if (loading) return <Loading message="Loading students..." />;

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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Students
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/students/add")}
        >
          Add Student
        </Button>
      </Box>

      <StudentFilters
        onApply={(f) => setActiveFilters(f)}
        onReset={() =>
          setActiveFilters({ search: "", course: "", status: "", scoreRange: "" })
        }
        courses={courses}
      />

      {filteredStudents.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No students found.
          </Typography>
          <Button variant="contained" onClick={() => router.push("/students/add")}>
            Add Student
          </Button>
        </Box>
      ) : (
        <StudentTable students={filteredStudents} onDelete={handleDelete} />
      )}
    </Box>
  );
}