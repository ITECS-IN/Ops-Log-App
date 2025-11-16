import { useEffect } from "react";

import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 Not Found | Ops-log";
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-red-500">404</h1>
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground text-center px-4">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="text-primary underline text-base sm:text-lg">Go to Dashboard</Link>
    </div>
  );
}
