"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box, Typography, Paper, TextField,
  Button, Alert, MenuItem,
} from "@mui/material";
import { studentService } from "@/services/studentService";
import { Student } from "@/types/student";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading/Loading";
import { toast } from "react-toastify";

const COURSES = ["React", "Node.js", "Python", "Java", "Angular", "Flutter"];
const BATCHES = ["Batch A", "Batch B", "Batch C", "Batch D"];

export default function StudentProfileEditView() {
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: student?.firstName ?? "",
      lastName: student?.lastName ?? "",
      phone: student?.phone ?? "",
      dateOfBirth: student?.dateOfBirth ?? "",
      course: student?.course ?? "",
      batch: student?.batch ?? "",
      experience: student?.experience ?? "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Required"),
      lastName: Yup.string().required("Required"),
      phone: Yup.string().matches(/^[0-9]{10}$/, "10 digits required").required("Required"),
      dateOfBirth: Yup.string().required("Required"),
      course: Yup.string().required("Required"),
      batch: Yup.string().required("Required"),
      experience: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await studentService.updateStudent(student!.id, {
          ...student!,
          ...values,
        });
        toast.success("Profile updated successfully!");
        router.push("/profile");
      } catch {
        toast.error("Failed to update profile");
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (loading) return <Loading message="Loading profile..." />;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
        Edit Profile
      </Typography>

      <Paper elevation={2} sx={{ p: 4, borderRadius: 3, maxWidth: 700 }}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth label="First Name" name="firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
              <TextField
                fullWidth label="Last Name" name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange} onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Box>

            {/* Email — Read only */}
            <TextField
              fullWidth label="Email"
              value={student?.email ?? ""}
              disabled
              helperText="Email cannot be changed"
            />

            <TextField
              fullWidth label="Phone" name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            <TextField
              fullWidth label="Date of Birth" name="dateOfBirth" type="date"
              value={formik.values.dateOfBirth}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)}
              helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select fullWidth label="Course" name="course"
              value={formik.values.course}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.course && Boolean(formik.errors.course)}
              helperText={formik.touched.course && formik.errors.course}
            >
              {COURSES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>

            <TextField
              select fullWidth label="Batch" name="batch"
              value={formik.values.batch}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.batch && Boolean(formik.errors.batch)}
              helperText={formik.touched.batch && formik.errors.batch}
            >
              {BATCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </TextField>

            <TextField
              fullWidth label="Experience" name="experience"
              value={formik.values.experience}
              onChange={formik.handleChange} onBlur={formik.handleBlur}
              error={formik.touched.experience && Boolean(formik.errors.experience)}
              helperText={formik.touched.experience && formik.errors.experience}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Button variant="outlined" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                type="submit" variant="contained"
                disabled={formik.isSubmitting}
              >
                {formik.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}