import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';
import { LanguageProvider } from "@/context/LanguageContext";

export function render(url: string) {
  // Only render landing page for SSR
  const html = renderToString(
    <StrictMode>
      <LanguageProvider>
        <StaticRouter location={url}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </StaticRouter>
      </LanguageProvider>
    </StrictMode>
  );
  return { html };
}
