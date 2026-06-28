import { Navigate, Route, Routes } from "react-router-dom";
import { AdminPreview } from "../pages/AdminPreview";
import { Home } from "../pages/Home";
import { PublicLanding } from "../pages/PublicLanding";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/site/demo" element={<Navigate to="/site/barbearia-demo" replace />} />
      <Route path="/site/:slug" element={<PublicLanding />} />
      <Route path="/admin" element={<AdminPreview />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
