"use client"

import { createContext, useContext, useState, useEffect } from "react"

const SuperAdminAuthContext = createContext()

export const useSuperAdminAuth = () => {
  const context = useContext(SuperAdminAuthContext)
  if (!context) {
    throw new Error("useSuperAdminAuth must be used within a SuperAdminAuthProvider")
  }
  return context
}

export const SuperAdminAuthProvider = ({ children }) => {
  const [superAdmin, setSuperAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing super admin session
    const token = localStorage.getItem("superAdminToken")
    const superAdminData = localStorage.getItem("superAdmin")

    if (token && superAdminData) {
      setSuperAdmin(JSON.parse(superAdminData))
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/admin/superadmin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        localStorage.setItem("superAdminToken", data.token)
        localStorage.setItem("superAdmin", JSON.stringify(data.admin))
        setSuperAdmin(data.admin)
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const createAdmin = async (adminData) => {
    try {
      const response = await fetch("/api/admin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("superAdminToken")}`,
        },
        body: JSON.stringify(adminData),
      })

      const data = await response.json()
      return data
    } catch (error) {
      return { success: false, message: "Network error. Please try again." }
    }
  }

  const logout = () => {
    localStorage.removeItem("superAdminToken")
    localStorage.removeItem("superAdmin")
    setSuperAdmin(null)
  }

  const value = {
    superAdmin,
    login,
    createAdmin,
    logout,
    loading,
  }

  return <SuperAdminAuthContext.Provider value={value}>{children}</SuperAdminAuthContext.Provider>
}
