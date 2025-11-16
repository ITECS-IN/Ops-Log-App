import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Security from './pages/Security';
import { LanguageProvider } from "@/context/LanguageContext";

export function render(url: string) {
  // Render public pages for SSR
  const html = renderToString(
    <StrictMode>
      <LanguageProvider>
        <StaticRouter location={url}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/security" element={<Security />} />
          </Routes>
        </StaticRouter>
      </LanguageProvider>
    </StrictMode>
  );
  return { html };
}
