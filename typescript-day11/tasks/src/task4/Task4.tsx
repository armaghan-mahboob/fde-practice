// Note: Dear reader the API does not return Pakistani data.

import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: {
    name: string;
  };
}

type FetchStatus = "idle" | "loading" | "success" | "error";

export default function ApiUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      setStatus("loading");
      setErrorMessage("");
      setSelectedUser(null);

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from API.");
        }

        const validUsers = data.filter((item): item is User => {
          if (!item || typeof item !== "object") return false;
          const user = item as Record<string, unknown>;

          return (
            typeof user.id === "number" &&
            typeof user.name === "string" &&
            typeof user.email === "string" &&
            typeof user.phone === "string" &&
            user.company !== null &&
            typeof user.company === "object" &&
            typeof (user.company as Record<string, unknown>).name === "string"
          );
        });

        if (isMounted) {
          setUsers(validUsers);
          setStatus("success");
        }
      } catch (error: unknown) {
        if (isMounted) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to fetch users. Please check your connection.";
          setErrorMessage(message);
          setStatus("error");
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchUsers = async () => {
    setStatus("loading");
    setErrorMessage("");
    setSelectedUser(null);

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: unknown = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from API.");
      }

      const validUsers = data.filter((item): item is User => {
        if (!item || typeof item !== "object") return false;
        const user = item as Record<string, unknown>;

        return (
          typeof user.id === "number" &&
          typeof user.name === "string" &&
          typeof user.email === "string" &&
          typeof user.phone === "string" &&
          user.company !== null &&
          typeof user.company === "object" &&
          typeof (user.company as Record<string, unknown>).name === "string"
        );
      });

      setUsers(validUsers);
      setStatus("success");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch users. Please check your connection.";
      setErrorMessage(message);
      setStatus("error");
    }
  };

  const uniqueCompanies = [
    "All",
    ...Array.from(new Set(users.map((u) => u.company.name))),
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCompany =
      selectedCompany === "All" || user.company.name === selectedCompany;
    return matchesSearch && matchesCompany;
  });

  const styles = {
    container: {
      maxWidth: "1100px",
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
    warningText: {
      color: "#dc2626",
      fontWeight: "600",
      fontSize: "1rem",
      marginTop: "8px",
    },
    controlsCard: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "20px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      marginBottom: "30px",
      display: "flex",
      gap: "20px",
      flexWrap: "wrap" as const,
    },
    inputGroup: {
      flex: "1 1 250px",
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
      backgroundColor: "#f9fafb",
    },
    contentLayout: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
      alignItems: "start",
    },
    listGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "16px",
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    card: (isSelected: boolean) => ({
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: isSelected
        ? "0 0 0 2px #4f46e5, 0 4px 6px -1px rgba(0,0,0,0.1)"
        : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      cursor: "pointer",
      transition: "all 0.2s",
      borderTop: isSelected ? "4px solid #4f46e5" : "4px solid transparent",
    }),
    cardTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#111827",
      margin: "0 0 8px 0",
    },
    cardText: {
      fontSize: "0.875rem",
      color: "#4b5563",
      margin: "4px 0",
      display: "flex",
      gap: "8px",
    },
    detailCard: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      position: "sticky" as const,
      top: "20px",
      borderTop: "4px solid #4f46e5",
    },
    detailTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "16px",
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "12px",
    },
    detailRow: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "2px",
      marginBottom: "12px",
    },
    detailLabel: {
      fontSize: "0.75rem",
      fontWeight: "600",
      color: "#6b7280",
      textTransform: "uppercase" as const,
    },
    detailValue: {
      fontSize: "1rem",
      color: "#1f2937",
    },
    loadingBox: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      padding: "60px",
      color: "#4f46e5",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: "4px solid #e0e7ff",
      borderTop: "4px solid #4f46e5",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginBottom: "16px",
    },
    errorBox: {
      textAlign: "center" as const,
      padding: "40px",
      backgroundColor: "#fee2e2",
      borderRadius: "12px",
      color: "#991b1b",
      border: "1px solid #f87171",
    },
    retryBtn: {
      marginTop: "16px",
      padding: "10px 20px",
      backgroundColor: "#dc2626",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
    },
    emptyState: {
      textAlign: "center" as const,
      padding: "40px",
      color: "#9ca3af",
      gridColumn: "1 / -1",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      <header style={styles.header}>
        <h1 style={styles.title}>User Directory</h1>
        <p style={styles.warningText}>
          Note: This API does not return Pakistani data.
        </p>
      </header>

      <div style={styles.controlsCard}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Search by Name</label>
          <input
            style={styles.input}
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Filter by Company</label>
          <select
            style={styles.input}
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            {uniqueCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "loading" && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          <p>Fetching users from API...</p>
        </div>
      )}

      {status === "error" && (
        <div style={styles.errorBox}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "8px" }}>
            Oops! Something went wrong.
          </h3>
          <p>{errorMessage}</p>
          <button style={styles.retryBtn} onClick={fetchUsers}>
            Try Again
          </button>
        </div>
      )}

      {status === "success" && (
        <div style={styles.contentLayout}>
          <div>
            {filteredUsers.length === 0 ? (
              <div style={styles.emptyState}>
                <p>No users found matching your criteria.</p>
              </div>
            ) : (
              <ul style={styles.listGrid}>
                {filteredUsers.map((user) => (
                  <li
                    key={user.id}
                    style={styles.card(selectedUser?.id === user.id)}
                    onClick={() => setSelectedUser(user)}
                  >
                    <h3 style={styles.cardTitle}>{user.name}</h3>
                    <div style={styles.cardText}>
                      <strong>Email:</strong> {user.email}
                    </div>
                    <div style={styles.cardText}>
                      <strong>Phone:</strong> {user.phone}
                    </div>
                    <div style={styles.cardText}>
                      <strong>Company:</strong> {user.company.name}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selectedUser && (
            <div style={styles.detailCard}>
              <h2 style={styles.detailTitle}>{selectedUser.name}</h2>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Email Address</span>
                <span style={styles.detailValue}>{selectedUser.email}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Phone Number</span>
                <span style={styles.detailValue}>{selectedUser.phone}</span>
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Company</span>
                <span style={styles.detailValue}>
                  {selectedUser.company.name}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
