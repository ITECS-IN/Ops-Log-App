import { useEffect, useState, type ReactNode } from "react";
import { CompanyContext } from "./CompanyContextDef";
import type { Company } from "./CompanyContextDef";
import api from "@/lib/axios";
import { getAuth } from "firebase/auth";





export function CompanyProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await api.get("/company");
      setCompany(res.data || null);
    } catch {
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }
    fetchCompany();
  }, []);

  return (
    <CompanyContext.Provider value={{ company, loading, refresh: fetchCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}
