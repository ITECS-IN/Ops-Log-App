import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/AppLogo";
import { getAuth, signOut } from "firebase/auth";
import firebaseApp from "@/lib/firebase";
import { toast } from "sonner";
import { useCompany } from "@/context/useCompany";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/manage-lines-machines": "Manage Lines & Machines",
  "/admin": "Admin Panel",
  "/login": "Login",
};

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || "Shift Log App";
  const navigate = useNavigate();

  const { company, loading } = useCompany();

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Go to Dashboard"
            onClick={() => navigate("/")}
            className="focus:outline-none"
            style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
          >
            <AppLogo size={44} />
          </button>
          <h1 className="text-xl font-bold whitespace-nowrap mr-4">{title}</h1>
          {company?.companyName && !loading && (
            <span className="text-primary font-semibold text-lg tracking-wide bg-primary/10 rounded px-3 py-1 shadow-sm border border-primary/30 whitespace-nowrap">
              {company.companyName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin")}
            className="mr-2"
          >
            Admin Settings
          </Button>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
