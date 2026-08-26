"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

interface Filters {
  search: string;
  course: string;
  status: string;
  scoreRange: string;
}

interface StudentFiltersProps {
  onApply: (filters: Filters) => void;
  onReset: () => void;
  courses: string[];
}

export default function StudentFilters({
  onApply,
  onReset,
  courses,
}: StudentFiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    course: "",
    status: "",
    scoreRange: "",
  });

  const handleApply = () => onApply(filters);

  const handleReset = () => {
    const empty = { search: "", course: "", status: "", scoreRange: "" };
    setFilters(empty);
    onReset();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        alignItems: "center",
      }}
    >
      {/* Search */}
      <TextField
        label="Search by name or email"
        value={filters.search}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, search: e.target.value }))
        }
        size="small"
        sx={{ minWidth: 220 }}
      />

      {/* Course */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="course-label">Course</InputLabel>
        <Select
          labelId="course-label"
          value={filters.course}
          label="Course"
          onChange={(e: SelectChangeEvent) =>
            setFilters((prev) => ({ ...prev, course: e.target.value }))
          }
          MenuProps={{
            PaperProps: {
              sx: { maxHeight: 300 },
            },
          }}
        >
          <MenuItem value="">All</MenuItem>
          {courses.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="status-label">Status</InputLabel>
        <Select
          labelId="status-label"
          value={filters.status}
          label="Status"
          onChange={(e: SelectChangeEvent) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Active">Active</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
          <MenuItem value="Inactive">Inactive</MenuItem>
        </Select>
      </FormControl>

      {/* Score Range */}
      <FormControl size="small" sx={{ minWidth: 140 }}>
        <InputLabel id="score-label">Score</InputLabel>
        <Select
          labelId="score-label"
          value={filters.scoreRange}
          label="Score"
          onChange={(e: SelectChangeEvent) =>
            setFilters((prev) => ({ ...prev, scoreRange: e.target.value }))
          }
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="0-50">0 – 50</MenuItem>
          <MenuItem value="51-75">51 – 75</MenuItem>
          <MenuItem value="76-100">76 – 100</MenuItem>
        </Select>
      </FormControl>

      {/* Buttons */}
      <Button
        variant="contained"
        onClick={handleApply}
        sx={{ height: 40, px: 3 }}
      >
        Apply Filters
      </Button>
      <Button
        variant="outlined"
        onClick={handleReset}
        sx={{ height: 40, px: 3 }}
      >
        Reset
      </Button>
    </Box>
  );
}