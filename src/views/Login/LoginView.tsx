"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";

const DEMO_EMAIL = "ronak@gmail";
const DEMO_PASSWORD = "123456";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Valid email")
    .required("Email required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password required hai"),
});

export default function LoginView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      setTimeout(() => {
        if (
          values.email === DEMO_EMAIL &&
          values.password === DEMO_PASSWORD
        ) {
          // Pehle localStorage set karo
          localStorage.setItem("admin", JSON.stringify({ 
            name: "Admin", 
            email: values.email 
          }));
          
          toast.success("Welcome back, Admin!");
          
          // Direct redirect — toast ka wait nahi
          window.location.href = "/dashboard";
        } else {
          setFieldError("password", "Invalid email or password");
          toast.error("Invalid credentials!");
          setSubmitting(false);
        }
      }, 600);
    },
  });

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
      <Paper
        elevation={6}
        sx={{ p: 5, width: "100%", maxWidth: 420, borderRadius: 3 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            🎓 EduAdmin
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Student Management System
          </Typography>
        </Box>

        <Typography variant="h6" fontWeight="bold" mb={3}>
          Sign In
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* Email Field */}
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email Address"
            type="email"
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

          {/* Password Field */}
          <TextField
            fullWidth
            id="password"
            name="password"
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
                    <IconButton
                      onClick={() => setShowPassword((p) => !p)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={formik.isSubmitting}
            sx={{ borderRadius: 2, py: 1.4, fontWeight: "bold" }}
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}