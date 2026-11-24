import React, { useState } from "react";

interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  marks: number;
}

type FormMode = "add" | "edit";

export default function StudentManagementApp() {
  const [students, setStudents] = useState<Student[]>([]);
  const [mode, setMode] = useState<FormMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [marks, setMarks] = useState("");
  const [error, setError] = useState("");

  const PASS_THRESHOLD = 50;

  // --- Styles Object ---
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "0 20px",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      textAlign: "center" as const,
      marginBottom: "30px",
    },
    title: {
      fontSize: "2.5rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "8px",
    },
    subtitle: {
      color: "#6b7280",
      fontSize: "1rem",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "24px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      marginBottom: "30px",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginBottom: "16px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
    },
    input: {
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.2s",
      backgroundColor: "#f9fafb",
    },
    buttonRow: {
      display: "flex",
      gap: "12px",
      marginTop: "10px",
    },
    btnPrimary: {
      padding: "10px 20px",
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "0.95rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    btnSecondary: {
      padding: "10px 20px",
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "0.95rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    errorText: {
      color: "#dc2626",
      fontSize: "0.875rem",
      marginBottom: "10px",
      fontWeight: "500",
    },
    list: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "16px",
      listStyle: "none",
    },
    studentCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      borderLeft: "4px solid #4f46e5",
    },
    studentInfo: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "4px",
    },
    studentName: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#111827",
    },
    studentEmail: {
      fontSize: "0.875rem",
      color: "#6b7280",
    },
    studentDetails: {
      display: "flex",
      gap: "16px",
      fontSize: "0.875rem",
      color: "#4b5563",
      marginTop: "4px",
    },
    badgePass: {
      padding: "4px 10px",
      borderRadius: "9999px",
      backgroundColor: "#dcfce7",
      color: "#166534",
      fontSize: "0.75rem",
      fontWeight: "600",
    },
    badgeFail: {
      padding: "4px 10px",
      borderRadius: "9999px",
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      fontSize: "0.75rem",
      fontWeight: "600",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
    },
    btnEdit: {
      padding: "8px 16px",
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    },
    btnDelete: {
      padding: "8px 16px",
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "40px",
      color: "#9ca3af",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "2px dashed #e5e7eb",
    },
  };

  // --- Handlers ---
  const resetForm = () => {
    setName("");
    setEmail("");
    setAge("");
    setMarks("");
    setError("");
    setMode("add");
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name cannot be blank.");
      return;
    }

    const parsedAge = Number(age);
    const parsedMarks = Number(marks);

    if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
      setError("Marks must be a number between 0 and 100.");
      return;
    }

    if (isNaN(parsedAge) || parsedAge <= 0) {
      setError("Age must be a valid positive number.");
      return;
    }

    if (mode === "add") {
      const newStudent: Student = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        age: parsedAge,
        marks: parsedMarks,
      };
      setStudents((prev) => [...prev, newStudent]);
    } else if (mode === "edit" && editingId) {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: name.trim(),
                email: email.trim(),
                age: parsedAge,
                marks: parsedMarks,
              }
            : s,
        ),
      );
    }

    resetForm();
  };

  const handleEditClick = (student: Student) => {
    setMode("edit");
    setEditingId(student.id);
    setName(student.name);
    setEmail(student.email);
    setAge(student.age.toString());
    setMarks(student.marks.toString());
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up to form
  };

  const handleDelete = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  // --- Render ---
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Student Management</h1>
        <p style={styles.subtitle}>
          Total Enrolled: <strong>{students.length}</strong>
        </p>
      </header>

      {/* Form Section */}
      <div style={styles.card}>
        <h2
          style={{
            marginBottom: "20px",
            fontSize: "1.25rem",
            color: "#111827",
          }}
        >
          {mode === "add" ? "Add New Student" : "Edit Student Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                style={styles.input}
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Age</label>
              <input
                style={styles.input}
                type="number"
                placeholder="e.g. 20"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Marks (0-100)</label>
              <input
                style={styles.input}
                type="number"
                placeholder="e.g. 85"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
              />
            </div>
          </div>

          {error && <div style={styles.errorText}>{error}</div>}

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.btnPrimary}>
              {mode === "add" ? "Add Student" : "Save Changes"}
            </button>
            {mode === "edit" && (
              <button
                type="button"
                onClick={resetForm}
                style={styles.btnSecondary}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <h2
        style={{ marginBottom: "20px", fontSize: "1.5rem", color: "#111827" }}
      >
        Student List
      </h2>

      {students.length === 0 ? (
        <div style={styles.emptyState}>
          <p>
            No students have been added yet. Use the form above to get started.
          </p>
        </div>
      ) : (
        <ul style={styles.list}>
          {students.map((student) => (
            <li key={student.id} style={styles.studentCard}>
              <div style={styles.studentInfo}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <span style={styles.studentName}>{student.name}</span>
                  <span
                    style={
                      student.marks >= PASS_THRESHOLD
                        ? styles.badgePass
                        : styles.badgeFail
                    }
                  >
                    {student.marks >= PASS_THRESHOLD ? "PASS" : "FAIL"}
                  </span>
                </div>
                <span style={styles.studentEmail}>
                  {student.email || "No email provided"}
                </span>
                <div style={styles.studentDetails}>
                  <span>
                    <strong>Age:</strong> {student.age}
                  </span>
                  <span>
                    <strong>Marks:</strong> {student.marks}/100
                  </span>
                </div>
              </div>

              <div style={styles.actionButtons}>
                <button
                  onClick={() => handleEditClick(student)}
                  style={styles.btnEdit}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student.id)}
                  style={styles.btnDelete}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
