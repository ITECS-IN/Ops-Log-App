import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { CompanyProvider } from "@/context/CompanyContext";
import { LoginRedirectIfAuthenticated } from './components/auth/LoginRedirectIfAuthenticated';
import { Toaster } from 'sonner';
import NotFound from './pages/NotFound';
import { LanguageProvider } from "@/context/LanguageContext";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => (
  <StrictMode>
    <LanguageProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/login" element={<LoginRedirectIfAuthenticated><Login /></LoginRedirectIfAuthenticated>} />
          <Route path="/signup" element={<LoginRedirectIfAuthenticated><Signup /></LoginRedirectIfAuthenticated>} />
          <Route path="/dashboard" element={<ProtectedRoute><CompanyProvider><Layout><Dashboard /></Layout></CompanyProvider></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><CompanyProvider><Layout><AdminPage /></Layout></CompanyProvider></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>
);

const rootElement = document.getElementById('root')!;

// Check if page was server-rendered by looking for existing content
const isSSR = rootElement.hasChildNodes();

if (isSSR) {
  // Hydrate for SSR'd pages (/)
  hydrateRoot(rootElement, <App />);
} else {
  // Create root for client-only pages (/login, /signup, etc.)
  createRoot(rootElement).render(<App />);
}
