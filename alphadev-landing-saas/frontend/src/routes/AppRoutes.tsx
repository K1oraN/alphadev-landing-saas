import { Navigate, Route, Routes } from "react-router-dom";
import { AdminPreview } from "../pages/AdminPreview";
import { Login } from "../pages/admin/Login";
import { Home } from "../pages/Home";
import { PublicLanding } from "../pages/PublicLanding";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/site/demo" element={<Navigate to="/site/barbearia-demo" replace />} />
      <Route path="/site/:slug" element={<PublicLanding />} />
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminPreview />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
