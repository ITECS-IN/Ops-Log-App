import type { ReactNode } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/AppLogo";
import { getAuth, signOut } from "firebase/auth";
import firebaseApp from "@/lib/firebase";
import { toast } from "sonner";
import { useCompany } from "@/context/useCompany";
import { Menu, X, Settings, LogOut } from "lucide-react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { company, loading } = useCompany();

  const handleLogout = async () => {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
    toast.success("Logged out successfully");
    setMobileMenuOpen(false);
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const handleAdminClick = () => {
    navigate("/admin");
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <button
              type="button"
              aria-label="Go to Dashboard"
              onClick={() => navigate("/dashboard")}
              className="focus:outline-none shrink-0"
              style={{ background: "none", border: "none", padding: 0, margin: 0, cursor: "pointer" }}
            >
              <AppLogo size={32} className="sm:hidden" />
              <AppLogo size={40} className="hidden sm:block md:hidden" />
              <AppLogo size={44} className="hidden md:block" />
            </button>

            {/* Title - Hidden on mobile, shown on tablet+ */}
            <h1 className="block text-base md:text-lg lg:text-xl font-bold truncate">
              {title}
            </h1>

            {/* Company Badge - Hidden on mobile, shown on md+ */}
            {company?.companyName && !loading && (
              <span className="inline-flex text-primary font-semibold text-xs lg:text-sm tracking-wide bg-primary/10 rounded px-2 lg:px-3 py-1 shadow-sm border border-primary/30 truncate max-w-[200px] lg:max-w-none">
                {company.companyName}
              </span>
            )}
          </div>

          {/* Right: Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              size="sm"
              className="text-xs md:text-sm"
            >
              <Settings className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden md:inline">Admin Settings</span>
              <span className="md:hidden">Admin</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              size="sm"
              className="text-xs md:text-sm"
            >
              <LogOut className="h-4 w-4 mr-1 md:mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-3 space-y-3">
              {/* Mobile: Menu Items */}
              <button
                onClick={handleAdminClick}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <Settings className="h-5 w-5 text-gray-700" />
                <span className="font-medium text-gray-900">Admin Settings</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-600">Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
