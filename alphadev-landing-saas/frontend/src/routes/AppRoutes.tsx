import { Navigate, Route, Routes } from "react-router-dom";
import { AdminPreview } from "../pages/AdminPreview";
import { AdminAppearance } from "../pages/admin/AdminAppearance";
import { AdminLandingMain } from "../pages/admin/AdminLandingMain";
import { Login } from "../pages/admin/Login";
import { AdminSections } from "../pages/admin/AdminSections";
import { AdminSeo } from "../pages/admin/AdminSeo";
import { AdminWhatsapp } from "../pages/admin/AdminWhatsapp";
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
        <Route path="/admin/landing" element={<AdminLandingMain />} />
        <Route path="/admin/sections" element={<AdminSections />} />
        <Route path="/admin/appearance" element={<AdminAppearance />} />
        <Route path="/admin/whatsapp" element={<AdminWhatsapp />} />
        <Route path="/admin/seo" element={<AdminSeo />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
