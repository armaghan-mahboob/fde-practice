import { useState } from "react";
import Task1 from "./task1/Task1";
import Task2 from "./task2/Task2";
import Task3 from "./task3/Task3";
import Task4 from "./task4/Task4";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "task1" | "task2" | "task3" | "task4"
  >("task1");

  const styles = {
    nav: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      flexWrap: "wrap" as const,
    },
    tabBtn: (isActive: boolean) => ({
      padding: "10px 24px",
      fontSize: "1rem",
      fontWeight: "600",
      borderRadius: "8px",
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s",
      backgroundColor: isActive ? "#4f46e5" : "#f3f4f6",
      color: isActive ? "#ffffff" : "#4b5563",
      boxShadow: isActive ? "0 4px 6px -1px rgba(79, 70, 229, 0.4)" : "none",
    }),
  };

  return (
    <div>
      <nav style={styles.nav}>
        <button
          style={styles.tabBtn(activeTab === "task1")}
          onClick={() => setActiveTab("task1")}
        >
          Task 1: Student Management
        </button>
        <button
          style={styles.tabBtn(activeTab === "task2")}
          onClick={() => setActiveTab("task2")}
        >
          Task 2: Product Dashboard
        </button>
        <button
          style={styles.tabBtn(activeTab === "task3")}
          onClick={() => setActiveTab("task3")}
        >
          Task 3: Registration
        </button>
        <button
          style={styles.tabBtn(activeTab === "task4")}
          onClick={() => setActiveTab("task4")}
        >
          Task 4: API Users
        </button>
      </nav>

      <main>
        {activeTab === "task1" && <Task1 />}
        {activeTab === "task2" && <Task2 />}
        {activeTab === "task3" && <Task3 />}
        {activeTab === "task4" && <Task4 />}
      </main>
    </div>
  );
}
