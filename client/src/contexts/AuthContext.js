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

  // Fetch fresh user data using the stored token
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await userApi.get("/auth/me")
      const userData = response.data
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return userData
    } catch (error) {
      console.error("Error fetching user data:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        await fetchCurrentUser()
      } else {
        localStorage.removeItem("user")
      }
      setLoading(false)
    }
    initializeAuth()
  }, [fetchCurrentUser])

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
      email: userData.email.toLowerCase().trim(), // ← fix casing
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed",
    }
  }
}

  const verifyEmail = async (email, code) => {
    try {
      const response = await userApi.post(`/auth/verify-email`, { email, code })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Verification failed" }
    }
  }

  const resendCode = async (email) => {
    try {
      const response = await userApi.post("/auth/resend-code", { email })
      return { 
        success: true, 
        message: response.data.message || "A new code has been sent!" 
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Failed to resend code" 
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
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error" }
    }
  }

  const resetPassword = async (token, password) => {
    try {
      const response = await userApi.post(`/auth/reset-password/${token}`, { password })
      return { success: true, message: response.data.message }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Error" }
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
    resendCode,
    fetchCurrentUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}