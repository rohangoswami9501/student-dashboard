
import { useState, useEffect } from "react";
import { Student, StudentInput } from "@/types/student";
import { studentService } from "@/services/studentService";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (err) {
      setError("Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (data: StudentInput) => {
    const newStudent = await studentService.createStudent(data);
    setStudents((prev) => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = async (id: number, data: StudentInput) => {
    const updated = await studentService.updateStudent(id, data);
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  const deleteStudent = async (id: number) => {
    await studentService.deleteStudent(id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    students,
    loading,
    error,
    loadStudents,
    addStudent,
    updateStudent,
    deleteStudent,
  };
}