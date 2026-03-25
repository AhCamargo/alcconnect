import AdminNumbersPage from "@/pages/AdminNumbersPage";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import NumbersPage from "@/pages/NumbersPage";
import CatalogPage from "@/pages/CatalogPage";
import MyNumbersPage from "@/pages/MyNumbersPage";
import WebhooksPage from "@/pages/WebhooksPage";
import LogsPage from "@/pages/LogsPage";
import DocsPage from "@/pages/DocsPage";
import { AdminProtectedRoute } from "./components/AdminProtectedRoute";

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
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="my-numbers" element={<MyNumbersPage />} />
        <Route path="webhooks" element={<WebhooksPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="docs" element={<DocsPage />} />
        <Route
          path="admin/numbers"
          element={
            <AdminProtectedRoute>
              <AdminNumbersPage />
            </AdminProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
