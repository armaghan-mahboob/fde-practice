import React, { useState } from "react";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
  gender: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  age?: string;
  gender?: string;
}

export default function RegistrationApp() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const MIN_AGE = 18;
  const MIN_PASSWORD_LENGTH = 8;

  const styles = {
    container: {
      maxWidth: "600px",
      margin: "40px auto",
      padding: "0 20px",
      fontFamily: "'Inter', sans-serif",
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "30px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "24px",
      textAlign: "center" as const,
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px",
      marginBottom: "16px",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
    },
    input: (hasError: boolean) => ({
      padding: "10px 14px",
      borderRadius: "8px",
      border: `1px solid ${hasError ? "#dc2626" : "#d1d5db"}`,
      fontSize: "0.95rem",
      outline: "none",
      transition: "border-color 0.2s",
      backgroundColor: "#f9fafb",
    }),
    errorText: {
      color: "#dc2626",
      fontSize: "0.75rem",
      fontWeight: "500",
    },
    radioGroup: {
      display: "flex",
      gap: "16px",
      marginTop: "4px",
    },
    radioLabel: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "0.95rem",
      color: "#374151",
      cursor: "pointer",
    },
    btnPrimary: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#4f46e5",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
      marginTop: "10px",
    },
    successCard: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "30px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      textAlign: "center" as const,
      borderTop: "4px solid #10b981",
    },
    successTitle: {
      color: "#065f46",
      fontSize: "1.5rem",
      fontWeight: "700",
      marginBottom: "16px",
    },
    successDetails: {
      textAlign: "left" as const,
      backgroundColor: "#f0fdf4",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
      color: "#166534",
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Changing a field clears or updates its relevant error
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
      isValid = false;
    }

    // Validate email format
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Require a minimum password length of eight characters
    if (!formData.password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
      isValid = false;
    }

    // Ensure password and confirm password match
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    // Check that age is a valid number and meets the chosen minimum age rule
    const parsedAge = Number(formData.age);
    if (!formData.age) {
      newErrors.age = "Age is required.";
      isValid = false;
    } else if (isNaN(parsedAge) || parsedAge < MIN_AGE) {
      newErrors.age = `You must be at least ${MIN_AGE} years old to register.`;
      isValid = false;
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    // Invalid submission does not show success
    if (validateForm()) {
      setIsSuccess(true);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      age: "",
      gender: "",
    });
    setErrors({});
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <h2 style={styles.successTitle}>Registration Successful!</h2>
          <div style={styles.successDetails}>
            <p>
              <strong>Name:</strong> {formData.fullName}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Age:</strong> {formData.age}
            </p>
            <p>
              <strong>Gender:</strong> {formData.gender}
            </p>
            {/* Password fields are not echoed in the success summary */}
          </div>
          <button onClick={handleReset} style={styles.btnSecondary}>
            Register Another User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create an Account</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input(!!errors.fullName)}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <span style={styles.errorText}>{errors.fullName}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input(!!errors.email)}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
            />
            {errors.email && (
              <span style={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input(!!errors.password)}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
            />
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              style={styles.input(!!errors.confirmPassword)}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && (
              <span style={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Age</label>
            <input
              style={styles.input(!!errors.age)}
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 25"
            />
            {errors.age && <span style={styles.errorText}>{errors.age}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <div style={styles.radioGroup}>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                />
                Male
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                />
                Female
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === "Other"}
                  onChange={handleChange}
                />
                Other
              </label>
            </div>
            {errors.gender && (
              <span style={styles.errorText}>{errors.gender}</span>
            )}
          </div>

          <button type="submit" style={styles.btnPrimary}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
