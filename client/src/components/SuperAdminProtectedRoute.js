import { Navigate } from "react-router-dom"
import { useSuperAdminAuth } from "../contexts/SuperAdminAuthContext"

const SuperAdminProtectedRoute = ({ children }) => {
  const { superAdmin, loading } = useSuperAdminAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return superAdmin ? children : <Navigate to="/superadmin/login" replace />
}

export default SuperAdminProtectedRoute
