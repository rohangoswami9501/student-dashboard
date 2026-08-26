import { Student, StudentInput } from "@/types/student";

const STORAGE_KEY = "students";

const SEED_DATA: Student[] = [
  {
    id: 1,
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@example.com",
    phone: "9876543210",
    dateOfBirth: "2000-05-15",
    course: "React",
    batch: "Batch A",
    startDate: "2024-01-10",
    trainer: "Amit Sir",
    experience: "1 year",
    status: "Active",
    score: 82,
    pendingAssignments: 2,
  },
  {
    id: 2,
    firstName: "Priya",
    lastName: "Verma",
    email: "priya.verma@example.com",
    phone: "9123456789",
    dateOfBirth: "2001-08-20",
    course: "Node.js",
    batch: "Batch B",
    startDate: "2024-02-01",
    trainer: "Neha Ma'am",
    experience: "Fresher",
    status: "Completed",
    score: 91,
    pendingAssignments: 0,
  },
  {
    id: 3,
    firstName: "Aman",
    lastName: "Gupta",
    email: "aman.gupta@example.com",
    phone: "9012345678",
    dateOfBirth: "1999-03-10",
    course: "Python",
    batch: "Batch A",
    startDate: "2024-03-15",
    trainer: "Ravi Sir",
    experience: "2 years",
    status: "Inactive",
    score: 45,
    pendingAssignments: 5,
  },
  {
    id: 4,
    firstName: "Sneha",
    lastName: "Patel",
    email: "sneha.patel@example.com",
    phone: "9345678901",
    dateOfBirth: "2002-11-25",
    course: "Java",
    batch: "Batch C",
    startDate: "2024-04-01",
    trainer: "Priya Ma'am",
    experience: "Fresher",
    status: "Active",
    score: 74,
    pendingAssignments: 1,
  },
  {
    id: 5,
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram.singh@example.com",
    phone: "9567890123",
    dateOfBirth: "1998-07-30",
    course: "Angular",
    batch: "Batch B",
    startDate: "2024-01-20",
    trainer: "Amit Sir",
    experience: "3 years",
    status: "Completed",
    score: 88,
    pendingAssignments: 0,
  },
];

export const studentService = {
  async getStudents(): Promise<Student[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const data = localStorage.getItem(STORAGE_KEY);
          if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
            resolve(SEED_DATA);
          } else {
            resolve(JSON.parse(data));
          }
        } catch (err) {
          reject(new Error("Failed to load students"));
        }
      }, 500);
    });
  },

  async getStudentById(id: number): Promise<Student | undefined> {
    const students = await this.getStudents();
    return students.find((s) => s.id === id);
  },

  async createStudent(data: StudentInput): Promise<Student> {
    const students = await this.getStudents();
    const newStudent: Student = {
      ...data,
      id: Date.now(),
    };
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return newStudent;
  },

  async updateStudent(id: number, data: StudentInput): Promise<Student> {
    const students = await this.getStudents();
    const index = students.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Student not found");
    students[index] = { ...students[index], ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return students[index];
  },

  async deleteStudent(id: number): Promise<void> {
    const students = await this.getStudents();
    const filtered = students.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};