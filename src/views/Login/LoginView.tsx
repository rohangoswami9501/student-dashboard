"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box, Button, TextField, Typography,
  Paper, InputAdornment, IconButton,
  RadioGroup, FormControlLabel, Radio, FormControl,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import { toast } from "react-toastify";
import { studentService } from "@/services/studentService";
import { AuthUser } from "@/types/auth";
import { useRouter } from "next/navigation";


const ADMIN_EMAIL = "admin@school.com";
const ADMIN_PASSWORD = "admin1234";
const STUDENT_DEFAULT_PASSWORD = "student1234";

export default function LoginView() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "student">("student");
  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email("Give Valid email").required("Email required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Password required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        if (role === "admin") {
          if (
            values.email !== ADMIN_EMAIL ||
            values.password !== ADMIN_PASSWORD
          ) {
            setFieldError("password", "Invalid admin credentials");
            toast.error("Invalid credentials!");
            return;
          }
          const authUser: AuthUser = {
            role: "admin",
            name: "Admin",
            email: values.email,
          };
          localStorage.setItem("authUser", JSON.stringify(authUser));
          toast.success("Welcome back, Admin!");
          router.push("/dashboard");
          return;
        }

        // Student login
        if (values.password !== STUDENT_DEFAULT_PASSWORD) {
          setFieldError("password", "Invalid password");
          toast.error("Invalid credentials!");
          return;
        }

        const students = await studentService.getStudents();
        const student = students.find(
          (s) => s.email.toLowerCase() === values.email.toLowerCase()
        );

        if (!student) {
          setFieldError("email", "Account not found or has been deleted");
          toast.error("Account not found!");
          return;
        }

        const authUser: AuthUser = {
          role: "student",
          name: `${student.firstName} ${student.lastName}`,
          email: student.email,
          studentId: student.id,
        };
        localStorage.setItem("authUser", JSON.stringify(authUser));
        toast.success(`Welcome, ${student.firstName}!`);
        // router.push("/profile")
        window.location.href = "/profile";

      } catch {
        toast.error("Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Role change--> form reset karo
  const handleRoleChange = (newRole: "admin" | "student") => {
    setRole(newRole);
    formik.resetForm();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
      }}
    >
      <Paper elevation={6} sx={{ p: 5, width: "100%", maxWidth: 440, borderRadius: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }} color="primary">
             EduAdmin
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Student Management System
          </Typography>
        </Box>

        {/* Role Selector */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }} color="text.secondary">
            Login As:
          </Typography>
          <RadioGroup
            row
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as "admin" | "student")}
          >
            <FormControlLabel
              value="admin"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <AdminPanelSettingsIcon fontSize="small" color="primary" />
                  <Typography variant="body2">Admin</Typography>
                </Box>
              }
              sx={{
                flex: 1,
                border: "1px solid",
                borderColor: role === "admin" ? "primary.main" : "#e0e0e0",
                borderRadius: 2,
                px: 1,
                py: 0.5,
                mr: 1,
                backgroundColor: role === "admin" ? "#e3f2fd" : "transparent",
                transition: "all 0.2s",
              }}
            />
            <FormControlLabel
              value="student"
              control={<Radio />}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <SchoolIcon fontSize="small" color="success" />
                  <Typography variant="body2">Student</Typography>
                </Box>
              }
              sx={{
                flex: 1,
                border: "1px solid",
                borderColor: role === "student" ? "success.main" : "#e0e0e0",
                borderRadius: 2,
                px: 1,
                py: 0.5,
                ml: 0,
                backgroundColor: role === "student" ? "#e8f5e9" : "transparent",
                transition: "all 0.2s",
              }}
            />
          </RadioGroup>
        </FormControl>

        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>
          {role === "admin" ? "Admin Sign In" : "Student Sign In"}
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate>
          <TextField
            fullWidth id="email" name="email"
            label="Email Address" type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth id="password" name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mb: 3 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit" fullWidth variant="contained" size="large"
            disabled={formik.isSubmitting}
            sx={{ borderRadius: 2, py: 1.4, fontWeight: "bold" }}
            color={role === "admin" ? "primary" : "success"}
          >
            {formik.isSubmitting ? "Signing in..." : `Sign In as ${role === "admin" ? "Admin" : "Student"}`}
          </Button>
        </form>

       
      </Paper>
    </Box>
  );
}