import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, Routes, Route } from 'react-router';
import LandingPage from './pages/LandingPage';

export function render(url: string) {
  // Only render landing page for SSR
  const html = renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </StaticRouter>
    </StrictMode>
  );
  return { html };
}
