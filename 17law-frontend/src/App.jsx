import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import Quizzes from "./pages/Quizzes.jsx";
import QuizTake from "./pages/QuizTake.jsx";
import Admin from "./pages/Admin.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminMaterials from "./pages/AdminMaterials.jsx";
import Settings from "./pages/Settings.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useLang } from "./context/LangContext.jsx";

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const { t } = useLang();
  if (loading) return <div className="container state-note">{t.loading}</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/quizzes"
          element={
            <RequireAuth>
              <Quizzes />
            </RequireAuth>
          }
        />
        <Route
          path="/quizzes/:id"
          element={
            <RequireAuth>
              <QuizTake />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        />
        <Route
          path="/admin/materials"
          element={
            <RequireAuth>
              <AdminMaterials />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />
      </Routes>
      <footer className="app-footer">17 LAW · STUDY ARCHIVE</footer>
    </div>
  );
}