import { useEffect } from "react";

import { Link } from "react-router-dom";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 Not Found | Shift Log";
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
      <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="mb-6 text-muted-foreground">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="text-primary underline text-lg">Go to Dashboard</Link>
    </div>
  );
}
