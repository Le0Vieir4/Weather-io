import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

export default function PrivateRoutes() {
  const { token } = useAuth()
  return token ? <Outlet /> : <Navigate to="/" replace />;
}