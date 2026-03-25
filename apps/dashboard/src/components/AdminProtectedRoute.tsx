import { useAuth } from "@/context/AuthContext";
import { JSX, ReactNode } from "react";
import { Navigate } from "react-router-dom";

type AdminProtectedRouteProps = {
  children: ReactNode;
};

export function AdminProtectedRoute({
  children,
}: AdminProtectedRouteProps): JSX.Element {
  const { token, user } = useAuth();

  // Não autenticado
  if (!token || !user) return <Navigate to="/login" replace />;

  // Verifica apenas role admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
