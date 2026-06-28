import { Navigate, Route, Routes } from "react-router-dom";
import { AdminPreview } from "../pages/AdminPreview";
import { DemoLanding } from "../pages/DemoLanding";
import { Home } from "../pages/Home";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/site/demo" element={<DemoLanding />} />
      <Route path="/admin" element={<AdminPreview />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
