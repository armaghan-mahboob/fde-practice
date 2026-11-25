import express, { Request, Response, NextFunction } from "express";

// interfaces, aliases, optional properties
interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  course: string;
  marks: number;
  pass: boolean;
}

type StudentInput = Omit<Student, "id" | "pass">;

type ApiError = {
  message: string;
};

// in-memory array
let students: Student[] = [];

// validation functions
const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateStudentInput = (
  body: any,
  isUpdate: boolean = false,
): string | null => {
  const { name, email, age, course, marks } = body;

  if (!isUpdate) {
    if (
      name === undefined ||
      email === undefined ||
      age === undefined ||
      course === undefined ||
      marks === undefined
    ) {
      return "Missing required fields: name, email, age, course, marks.";
    }
  }

  if (name !== undefined && (typeof name !== "string" || name.trim() === "")) {
    return "Name must be a non-empty string.";
  }
  if (
    email !== undefined &&
    (typeof email !== "string" || !isValidEmail(email))
  ) {
    return "Invalid email format.";
  }
  if (
    age !== undefined &&
    (typeof age !== "number" || !Number.isInteger(age) || age <= 0)
  ) {
    return "Age must be a positive integer.";
  }
  if (
    course !== undefined &&
    (typeof course !== "string" || course.trim() === "")
  ) {
    return "Course must be a non-empty string.";
  }
  if (
    marks !== undefined &&
    (typeof marks !== "number" || marks < 0 || marks > 100)
  ) {
    return "Marks must be a number between 0 and 100.";
  }

  return null;
};

const app = express();
app.use(express.json());

// --- Routes ---

// GET /api/students
// search by name, filter by course
app.get("/api/students", (req: Request, res: Response) => {
  let result = [...students];

  const { name, course } = req.query;

  if (name) {
    result = result.filter((s) =>
      s.name.toLowerCase().includes(String(name).toLowerCase()),
    );
  }

  if (course) {
    result = result.filter(
      (s) => s.course.toLowerCase() === String(course).toLowerCase(),
    );
  }

  res.status(200).json(result);
});

// GET /api/students/stats
// total count, derive pass/fail
app.get("/api/students/stats", (req: Request, res: Response) => {
  const total = students.length;
  const passCount = students.filter((s) => s.pass).length;
  const failCount = total - passCount;

  res.status(200).json({
    total,
    pass: passCount,
    fail: failCount,
  });
});

// GET /api/students/:id
// invalid-ID handling
app.get("/api/students/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid ID format. ID must be a number." } as ApiError);
  }

  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ message: "Student not found." } as ApiError);
  }

  res.status(200).json(student);
});

// POST /api/students
// validation, derive pass/fail
app.post("/api/students", (req: Request, res: Response) => {
  const error = validateStudentInput(req.body);
  if (error) {
    return res.status(400).json({ message: error } as ApiError);
  }

  const { name, email, age, course, marks } = req.body;

  const newStudent: Student = {
    id: students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1,
    name,
    email,
    age,
    course,
    marks,
    pass: marks >= 40, // Derive pass/fail from marks
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});

// PUT /api/students/:id
// validation, invalid-ID handling
app.put("/api/students/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid ID format. ID must be a number." } as ApiError);
  }

  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found." } as ApiError);
  }

  const error = validateStudentInput(req.body, true);
  if (error) {
    return res.status(400).json({ message: error } as ApiError);
  }

  const existingStudent = students[studentIndex];

  const updatedStudent: Student = {
    ...existingStudent,
    ...req.body,
    id: existingStudent.id,
  };

  if (req.body.marks !== undefined) {
    updatedStudent.pass = updatedStudent.marks >= 40;
  }

  students[studentIndex] = updatedStudent;
  res.status(200).json(updatedStudent);
});

// DELETE /api/students/:id
// invalid-ID handling
app.delete("/api/students/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    return res
      .status(400)
      .json({ message: "Invalid ID format. ID must be a number." } as ApiError);
  }

  const studentIndex = students.findIndex((s) => s.id === id);

  if (studentIndex === -1) {
    return res.status(404).json({ message: "Student not found." } as ApiError);
  }

  students = students.filter((s) => s.id !== id);
  res.status(204).send();
});

// middleware, error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" } as ApiError);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
