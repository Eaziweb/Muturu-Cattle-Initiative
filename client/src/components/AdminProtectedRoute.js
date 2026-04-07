// components/AdminProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../contexts/AdminAuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { admin, isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Verifying authentication...</p>
    </div>;
  }

  return isAuthenticated && admin ? children : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;