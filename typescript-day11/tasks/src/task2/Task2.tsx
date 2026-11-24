import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

type FormMode = "add" | "edit";

export default function ProductManagementDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [mode, setMode] = useState<FormMode>("add");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "0 20px",
      fontFamily: "'Inter', sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: "30px",
      flexWrap: "wrap" as const,
      gap: "15px",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#111827",
      margin: 0,
    },
    subtitle: {
      color: "#6b7280",
      fontSize: "1rem",
      marginTop: "4px",
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
    controlsRow: {
      display: "flex",
      gap: "16px",
      marginBottom: "20px",
      flexWrap: "wrap" as const,
    },
    controlGroup: {
      flex: "1 1 200px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px",
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
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    productCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      borderTop: "4px solid #4f46e5",
    },
    productCardOutOfStock: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "space-between",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      borderTop: "4px solid #dc2626",
      opacity: 0.85,
    },
    productHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "10px",
    },
    productName: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#111827",
      margin: 0,
    },
    badgeCategory: {
      padding: "4px 10px",
      borderRadius: "9999px",
      backgroundColor: "#e0e7ff",
      color: "#3730a3",
      fontSize: "0.75rem",
      fontWeight: "600",
    },
    badgeInStock: {
      padding: "4px 10px",
      borderRadius: "9999px",
      backgroundColor: "#dcfce7",
      color: "#166534",
      fontSize: "0.75rem",
      fontWeight: "600",
    },
    badgeOutOfStock: {
      padding: "4px 10px",
      borderRadius: "9999px",
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      fontSize: "0.75rem",
      fontWeight: "600",
    },
    productDetails: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px",
      fontSize: "0.875rem",
      color: "#4b5563",
      marginBottom: "16px",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
      marginTop: "auto",
    },
    btnEdit: {
      flex: 1,
      padding: "8px 16px",
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "500",
    },
    btnDelete: {
      flex: 1,
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
      gridColumn: "1 / -1",
    },
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("");
    setStock("");
    setError("");
    setMode("add");
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Product name cannot be blank.");
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    // Acceptance checks: price and stock cannot be negative
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      setError("Stock quantity cannot be negative.");
      return;
    }

    if (!category.trim()) {
      setError("Category is required.");
      return;
    }

    if (mode === "add") {
      const newProduct: Product = {
        id: crypto.randomUUID(),
        name: name.trim(),
        price: parsedPrice,
        category: category.trim(),
        stock: parsedStock,
      };
      setProducts((prev) => [...prev, newProduct]);
    } else if (mode === "edit" && editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: name.trim(),
                price: parsedPrice,
                category: category.trim(),
                stock: parsedStock,
              }
            : p,
        ),
      );
    }

    resetForm();
  };

  const handleEditClick = (product: Product) => {
    setMode("edit");
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setCategory(product.category);
    setStock(product.stock.toString());
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  // Search is case-insensitive; category filtering works with search
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Product Dashboard</h1>
          <p style={styles.subtitle}>
            Total Products: <strong>{products.length}</strong>
          </p>
        </div>
      </header>

      <div style={styles.card}>
        <h2
          style={{
            marginBottom: "20px",
            fontSize: "1.25rem",
            color: "#111827",
          }}
        >
          {mode === "add" ? "Add New Product" : "Edit Product Details"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Product Name</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Wireless Mouse"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Price ($)</label>
              <input
                style={styles.input}
                type="number"
                step="0.01"
                placeholder="e.g. 29.99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Category</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Electronics"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Stock Quantity</label>
              <input
                style={styles.input}
                type="number"
                placeholder="e.g. 50"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {error && <div style={styles.errorText}>{error}</div>}

          <div style={styles.buttonRow}>
            <button type="submit" style={styles.btnPrimary}>
              {mode === "add" ? "Add Product" : "Save Changes"}
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

      <div style={styles.card}>
        <div style={styles.controlsRow}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Search by Name</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Filter by Category</label>
            <select
              style={styles.input}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No products in the inventory yet. Add some above!</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No products match your search or filter criteria.</p>
          </div>
        ) : (
          <ul style={styles.list}>
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock === 0;
              return (
                <li
                  key={product.id}
                  style={
                    isOutOfStock
                      ? styles.productCardOutOfStock
                      : styles.productCard
                  }
                >
                  <div>
                    <div style={styles.productHeader}>
                      <h3 style={styles.productName}>{product.name}</h3>
                      <span style={styles.badgeCategory}>
                        {product.category}
                      </span>
                    </div>
                    <div style={styles.productDetails}>
                      <span>
                        <strong>Price:</strong> ${product.price.toFixed(2)}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <strong>Status:</strong>
                        <span
                          style={
                            isOutOfStock
                              ? styles.badgeOutOfStock
                              : styles.badgeInStock
                          }
                        >
                          {isOutOfStock
                            ? "Out of Stock"
                            : `In Stock (${product.stock})`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={styles.actionButtons}>
                    <button
                      onClick={() => handleEditClick(product)}
                      style={styles.btnEdit}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      style={styles.btnDelete}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
