// contexts/AdminAuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/adminApi"; 

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const adminData = localStorage.getItem("admin");

    if (token && adminData) {
      try {
        const parsedAdmin = JSON.parse(adminData);
        // Validate that we have a proper admin object
        if (parsedAdmin && parsedAdmin.id && parsedAdmin.email) {
          setAdmin(parsedAdmin);
          setIsAuthenticated(true);
        } else {
          // Clear invalid data
          localStorage.removeItem("adminToken");
          localStorage.removeItem("admin");
        }
      } catch (e) {
        console.error("Error parsing admin data:", e);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/admin/login", { email, password });
      const data = response.data;

      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        setAdmin(data.admin);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Network error. Please try again.";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const value = {
    admin,
    isAuthenticated,
    login,
    logout,
    loading,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};