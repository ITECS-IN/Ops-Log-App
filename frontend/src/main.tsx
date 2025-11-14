import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
// import App from './App';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { CompanyProvider } from "@/context/CompanyContext";
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { LoginRedirectIfAuthenticated } from './components/auth/LoginRedirectIfAuthenticated';
import { Toaster } from 'sonner';
import NotFound from './pages/NotFound';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-right" richColors />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginRedirectIfAuthenticated><Login /></LoginRedirectIfAuthenticated>} />
        <Route path="/signup" element={<LoginRedirectIfAuthenticated><Signup /></LoginRedirectIfAuthenticated>} />
        <Route path="/dashboard" element={<ProtectedRoute><CompanyProvider><Layout><Dashboard /></Layout></CompanyProvider></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><CompanyProvider><Layout><AdminPage /></Layout></CompanyProvider></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
