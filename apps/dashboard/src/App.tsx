import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import NumbersPage from "@/pages/NumbersPage";
import WebhooksPage from "@/pages/WebhooksPage";
import LogsPage from "@/pages/LogsPage";
import DocsPage from "@/pages/DocsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="numbers" element={<NumbersPage />} />
        <Route path="webhooks" element={<WebhooksPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="docs" element={<DocsPage />} />
      </Route>
    </Routes>
  );
}
