import { createContext } from "react";

export interface Company {
  companyName: string;
  shiftTimings?: string;
  reportEmails?: string;
  logoUrl?: string;
  companyLogoUrl?: string;
}

interface CompanyContextType {
  company: Company | null;
  loading: boolean;
  refresh: () => void;
}

export const CompanyContext = createContext<CompanyContextType | undefined>(undefined);