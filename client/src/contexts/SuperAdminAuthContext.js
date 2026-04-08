"use client"

import { createContext, useContext, useState, useEffect } from "react";
import adminApi from "../utils/adminApi"; // Import your configured Axios instance

const SuperAdminAuthContext = createContext();

export const useSuperAdminAuth = () => {
  const context = useContext(SuperAdminAuthContext);
  if (!context) {
    throw new Error("useSuperAdminAuth must be used within a SuperAdminAuthProvider");
  }
  return context;
};

export const SuperAdminAuthProvider = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing super admin session on mount
    const token = localStorage.getItem("superAdminToken");
    const superAdminData = localStorage.getItem("superAdmin");

    if (token && superAdminData) {
      try {
        setSuperAdmin(JSON.parse(superAdminData));
      } catch (error) {
        console.error("Error parsing superAdmin data:", error);
        localStorage.removeItem("superAdminToken");
        localStorage.removeItem("superAdmin");
      }
    }

    setLoading(false);
  }, []);

  /**
   * Login specifically for Super Admins
   * Hits the /admin/superadmin/login endpoint
   */
  const login = async (email, password) => {
    try {
      // adminApi already has baseURL: .../api
      // So we call /admin/superadmin/login
      const response = await adminApi.post("/admin/superadmin/login", { 
        email, 
        password 
      });

      const { success, token, admin, message } = response.data;

      if (success) {
        localStorage.setItem("superAdminToken", token);
        localStorage.setItem("superAdmin", JSON.stringify(admin));
        setSuperAdmin(admin);
        return { success: true };
      } else {
        return { success: false, message: message || "Login failed" };
      }
    } catch (error) {
      // Handle Axios errors (401, 405, 500, etc.)
      const errorMessage = error.response?.data?.message || "Network error. Please try again.";
      return { success: false, message: errorMessage };
    }
  };

  /**
   * Create a new regular admin
   * Required: SuperAdmin token (handled by adminApi interceptor)
   */
  const createAdmin = async (adminData) => {
    try {
      // We manually override the token for this request since adminApi 
      // defaults to 'adminToken' in your interceptor.
      // Alternatively, update adminApi.js to check for superAdminToken too.
      const response = await adminApi.post("/admin/create", adminData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("superAdminToken")}`
        }
      });
      
      return response.data;
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to create admin" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("superAdminToken");
    localStorage.removeItem("superAdmin");
    setSuperAdmin(null);
  };

  const value = {
    superAdmin,
    login,
    createAdmin,
    logout,
    loading,
  };

  return (
    <SuperAdminAuthContext.Provider value={value}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
};