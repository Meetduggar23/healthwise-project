import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import { AdminAuthProvider } from "./components/AdminAuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { ChatWidget } from "./components/ChatWidget";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { BookAppointment } from "./pages/BookAppointment";
import { MyAppointments } from "./pages/MyAppointments";
import { ChatPage } from "./pages/ChatPage";
import { Emergency } from "./pages/Emergency";
import { HealthTools } from "./pages/HealthTools";
import { HealthLibrary } from "./pages/HealthLibrary";
import { HealthFaq } from "./pages/HealthFaq";
import { VisitPrep } from "./pages/VisitPrep";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/book" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/tools" element={<HealthTools />} />
            <Route path="/library" element={<HealthLibrary />} />
            <Route path="/faq" element={<HealthFaq />} />
            <Route path="/visit-prep" element={<VisitPrep />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
          <ChatWidget />
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
