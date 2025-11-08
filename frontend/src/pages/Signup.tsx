
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/AppLogo";
import api from "@/lib/axios";
import { toast } from "sonner";


export default function Signup() {
  useEffect(() => {
    document.title = "Signup | Shift Log";
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      await api.post("/auth/signup", {
        email,
        password,
        companyName,
      });
      toast.success("Signup successful!");
      // Optionally redirect or show user/company info
      // window.location.href = "/";
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSignup}
        className="bg-white/90 dark:bg-gray-900/90 p-8 rounded-xl shadow-xl w-full max-w-md space-y-5 border border-gray-100 dark:border-gray-800 animate-fade-in"
      >
        <AppLogo size={64} className="mx-auto! mb-2!" />
        <h2 className="text-3xl font-extrabold mb-2 text-center text-primary tracking-tight">Create your Shift Log account</h2>
        <p className="text-center text-muted-foreground mb-2 text-sm">Sign up to get started</p>
        <div className="space-y-3">
          <input
            type="email"
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-gray-800 transition"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            disabled={loading}
          />
          <input
            type="password"
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-gray-800 transition"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="text"
            className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-gray-800 transition"
            placeholder="Company Name"
            value={companyName}
            onChange={e => setCompanyName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          className="w-full mt-2"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              Signing up...
            </span>
          ) : "Sign Up"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => window.location.href = '/login'}
        >
          Already have an account? Login
        </Button>
      </form>
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
