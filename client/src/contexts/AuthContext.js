// contexts/AuthContext.js
"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import userApi from "../utils/userApi"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Function to fetch current user data from the server
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await userApi.get("/auth/me")
      const userData = response.data
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error("Error fetching user data:", error)
      // If token is invalid, clear localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token) {
        // Always fetch fresh user data from server if token exists
        await fetchCurrentUser()
      } else if (userData) {
        // If no token but user data exists (unlikely scenario), clear it
        localStorage.removeItem("user")
      }
      setLoading(false)
    }

    initializeAuth()
  }, [fetchCurrentUser])

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const login = async (email, password) => {
    try {
      const response = await userApi.post("/auth/login", { email, password })
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)

      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await userApi.post("/auth/register", userData)
      return {
        success: true,
        message: response.data.message,
        memberID: response.data.memberID,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const forgotPassword = async (email) => {
    try {
      const response = await userApi.post("/auth/forgot-password", { email })
      return {
        success: true,
        message: response.data.message,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset email",
      }
    }
  }

  const resetPassword = async (token, password) => {
    try {
      const response = await userApi.post(`/auth/reset-password/${token}`, { password })
      return {
        success: true,
        message: response.data.message,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Password reset failed",
      }
    }
  }

  const verifyEmail = async (token) => {
    try {
      const response = await userApi.get(`/auth/verify-email/${token}`)
      return {
        success: true,
        message: response.data.message,
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Email verification failed",
      }
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateUser,
    fetchCurrentUser, // Expose this function
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}