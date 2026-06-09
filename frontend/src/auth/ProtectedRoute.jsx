import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
}

export default ProtectedRoute;
