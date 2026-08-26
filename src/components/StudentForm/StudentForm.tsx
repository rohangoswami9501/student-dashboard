"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box, Button, Step, StepLabel, Stepper,
  TextField, Typography, MenuItem, Paper,
} from "@mui/material";
import { Student } from "@/types/student";
import { studentService } from "@/services/studentService";
import { toast } from "react-toastify";

const COURSES = ["React", "Node.js", "Python", "Java", "Angular", "Flutter"];
const BATCHES = ["Batch A", "Batch B", "Batch C", "Batch D"];
const TRAINERS = ["Amit Sir", "Neha Ma'am", "Ravi Sir", "Priya Ma'am"];
const STEPS = ["Personal Info", "Course Info", "Confirmation"];

interface StudentFormProps {
  existingStudent?: Student;
  existingEmails: string[];
}

export default function StudentForm({ existingStudent, existingEmails }: StudentFormProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const isEdit = !!existingStudent;

  // Step 1 validation
  const step1Schema = Yup.object({
    firstName: Yup.string().required("First name required"),
    lastName: Yup.string().required("Last name required"),
    email: Yup.string()
      .email("Valid email required")
      .required("Email required")
      .test("unique-email", "Email already exists", (value) => {
        if (!value) return true;
        if (isEdit && value === existingStudent?.email) return true;
        return !existingEmails.includes(value.toLowerCase());
      }),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone required"),
    dob: Yup.string().required("Date of birth required"),
  });

  // Step 2 validation
  const step2Schema = Yup.object({
    course: Yup.string().required("Course required"),
    batch: Yup.string().required("Batch required"),
    startDate: Yup.string().required("Start date required"),
    trainer: Yup.string().required("Trainer required"),
    experience: Yup.string().required("Experience required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: existingStudent?.firstName ?? "",
      lastName: existingStudent?.lastName ?? "",
      email: existingStudent?.email ?? "",
      phone: existingStudent?.phone ?? "",
      dob: existingStudent?.dob ?? "",
      course: existingStudent?.course ?? "",
      batch: existingStudent?.batch ?? "",
      startDate: existingStudent?.startDate ?? "",
      trainer: existingStudent?.trainer ?? "",
      experience: existingStudent?.experience ?? "",
    },
    validationSchema: activeStep === 0 ? step1Schema : activeStep === 1 ? step2Schema : Yup.object(),
    validateOnChange: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (isEdit) {
          await studentService.updateStudent(existingStudent!.id, values);
          toast.success("Student updated successfully!");
        } else {
          await studentService.createStudent(values);
          toast.success("Student added successfully!");
        }
        router.push("/students");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Something went wrong";
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleNext = async () => {
    const schema = activeStep === 0 ? step1Schema : step2Schema;
    const errors = await schema.validate(formik.values, { abortEarly: false })
      .then(() => ({}))
      .catch((err: Yup.ValidationError) => {
        const errs: Record<string, string> = {};
        err.inner.forEach((e) => { if (e.path) errs[e.path] = e.message; });
        return errs;
      });

    formik.setTouched(
      Object.keys(formik.values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    formik.setErrors(errors);

    if (Object.keys(errors).length === 0) setActiveStep((s) => s + 1);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  // Step 1 — Personal Info
  const Step1 = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth label="First Name" name="firstName"
          value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          fullWidth label="Last Name" name="lastName"
          value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
      </Box>
      <TextField
        fullWidth label="Email" name="email" type="email"
        value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      <TextField
        fullWidth label="Phone" name="phone"
        value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.phone && Boolean(formik.errors.phone)}
        helperText={formik.touched.phone && formik.errors.phone}
      />
      <TextField
        fullWidth label="Date of Birth" name="dob" type="date"
        value={formik.values.dob} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.dob && Boolean(formik.errors.dob)}
        helperText={formik.touched.dob && formik.errors.dob}
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );

  // Step 2 — Course Info
  const Step2 = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        select fullWidth label="Course" name="course"
        value={formik.values.course} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.course && Boolean(formik.errors.course)}
        helperText={formik.touched.course && formik.errors.course}
      >
        {COURSES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
      </TextField>
      <TextField
        select fullWidth label="Batch" name="batch"
        value={formik.values.batch} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.batch && Boolean(formik.errors.batch)}
        helperText={formik.touched.batch && formik.errors.batch}
      >
        {BATCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
      </TextField>
      <TextField
        fullWidth label="Start Date" name="startDate" type="date"
        value={formik.values.startDate} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.startDate && Boolean(formik.errors.startDate)}
        helperText={formik.touched.startDate && formik.errors.startDate}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        select fullWidth label="Trainer" name="trainer"
        value={formik.values.trainer} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.trainer && Boolean(formik.errors.trainer)}
        helperText={formik.touched.trainer && formik.errors.trainer}
      >
        {TRAINERS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
      </TextField>
      <TextField
        fullWidth label="Experience" name="experience"
        value={formik.values.experience} onChange={formik.handleChange} onBlur={formik.handleBlur}
        error={formik.touched.experience && Boolean(formik.errors.experience)}
        helperText={formik.touched.experience && formik.errors.experience}
      />
    </Box>
  );

  // Step 3 — Confirmation (read-only)
  const Step3 = (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Typography variant="h6" fontWeight="bold" mb={1}>Confirm Details</Typography>
      {[
        ["First Name", formik.values.firstName],
        ["Last Name", formik.values.lastName],
        ["Email", formik.values.email],
        ["Phone", formik.values.phone],
        ["Date of Birth", formik.values.dob],
        ["Course", formik.values.course],
        ["Batch", formik.values.batch],
        ["Start Date", formik.values.startDate],
        ["Trainer", formik.values.trainer],
        ["Experience", formik.values.experience],
      ].map(([label, value]) => (
        <Box key={label} sx={{ display: "flex", gap: 2, borderBottom: "1px solid #eee", pb: 1 }}>
          <Typography sx={{ width: 140, color: "text.secondary", fontSize: 14 }}>{label}:</Typography>
          <Typography fontWeight="medium" fontSize={14}>{value}</Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Paper elevation={2} sx={{ p: 4, borderRadius: 3, maxWidth: 700, mx: "auto" }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <form onSubmit={formik.handleSubmit}>
        {activeStep === 0 && Step1}
        {activeStep === 1 && Step2}
        {activeStep === 2 && Step3}

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            onClick={activeStep === 0 ? () => router.back() : handleBack}
            variant="outlined"
          >
            {activeStep === 0 ? "Cancel" : "Back"}
          </Button>

          {activeStep < 2 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Saving..." : isEdit ? "Update Student" : "Add Student"}
            </Button>
          )}
        </Box>
      </form>
    </Paper>
  );
}