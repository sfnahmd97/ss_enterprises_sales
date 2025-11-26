import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { type JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; 
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check → if allowedRoles is set and user.role doesn't match
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
