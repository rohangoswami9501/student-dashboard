"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Box, Button, Chip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Student } from "@/types/student";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";

interface StudentTableProps {
  students: Student[];
  onDelete: (id: number) => void;
}

const statusColor = (status: string) => {
  if (status === "Active") return "success";
  if (status === "Completed") return "primary";
  return "default";
};

export default function StudentTable({
  students,
  onDelete,
}: StudentTableProps) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleDeleteClick = (student: Student) => {
    setSelectedStudent(student);
    setDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStudent) {
      onDelete(selectedStudent.id);
      setDialogOpen(false);
      setSelectedStudent(null);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 130,
      valueGetter: (_value: unknown, row: Student) =>
        `${row.firstName} ${row.lastName}`,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 180,
    },
    {
      field: "course",
      headerName: "Course",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Chip
            label={params.value}
            color={
              statusColor(params.value) as "success" | "primary" | "default"
            }
            size="small"
          />
        </Box>
      ),
    },
    {
      field: "score",
      headerName: "Score",
      flex: 0.7,
      minWidth: 80,
      valueFormatter: (value: number) => `${value}%`,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0,
      width: 260,      // ← fixed width, flex nahi
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            height: "100%",
            width: "100%",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityIcon />}
            onClick={() => router.push(`/students/${params.row.id}`)}
          >
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="warning"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/students/${params.row.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteClick(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <DataGrid
        rows={students}
        columns={columns}
        rowHeight={60}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          borderRadius: 2,
          backgroundColor: "white",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            overflow: "visible !important",  // ← important fix
          },
          "& .MuiDataGrid-row": {
            overflow: "visible !important",  // ← important fix
          },
        }}
      />
      <ConfirmDialog
        open={dialogOpen}
        title="Delete Student"
        message={`Are you sure you want to delete ${selectedStudent?.firstName} ${selectedStudent?.lastName}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  );
}