import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/ui/AppLogo";
import firebaseApp from "@/lib/firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export default function Login() {
  useEffect(() => {
    document.title = "Login | Ops-log";
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Replace 'any' with a more specific type or 'unknown' for user
  const [user, setUser] = useState<unknown>(null);

  const auth = getAuth(firebaseApp);
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      toast.success(t('common.loginSuccess', 'Login successful'));
  } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('common.loginFailed', 'Login failed'));
      }
      toast.error(t('common.loginFailed', 'Login failed'));
    } finally {
      setLoading(false);
    }
  };


  if (user) {
    return <Outlet />;
  }

  return (
  <div className="relative flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4 sm:px-6">
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                <LanguageSwitcher size="sm" />
              </div>
              <p className="text-center text-muted-foreground mb-4 text-xs sm:text-sm">
                <span>{t('common.backTo', 'Back to')} </span>
                <a
                  href="/"
                  className="text-primary underline font-medium hover:text-primary/80 transition-colors"
                  aria-label="Go to Ops-log home"
                >
                  {t('common.home', 'Ops-log Home')}
                </a>
              </p>

      <form
        onSubmit={handleLogin}
        className="bg-white/90 dark:bg-gray-900/90 p-6 sm:p-8 md:p-10 rounded-xl shadow-xl w-full max-w-[90%] sm:max-w-md space-y-4 sm:space-y-5 border border-gray-100 dark:border-gray-800 animate-fade-in"
      >
        <div className="flex justify-center mb-2">
          <AppLogo size={48} className="sm:hidden" />
          <AppLogo size={64} className="hidden sm:block" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-primary tracking-tight">{t('login.title', 'Sign in to Ops-log')}</h2>
        <p className="text-center text-muted-foreground mb-2 text-xs sm:text-sm">{t('login.subtitle', 'Enter your credentials to continue')}</p>
        <div className="space-y-3 sm:space-y-4">
          <input
            type="email"
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 sm:py-3 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-gray-800 transition"
            placeholder={t('common.placeholderEmail', 'Email')}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2.5 sm:py-3 w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-gray-800 transition"
            placeholder={t('common.placeholderPassword', 'Password')}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-xs sm:text-sm text-center mt-1">{error}</div>}
        <Button
          type="submit"
          className="w-full mt-2 py-2.5 sm:py-3 text-sm sm:text-base"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
              {t('login.loading', 'Logging in...')}
            </span>
          ) : t('login.button', 'Login')}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full py-2.5 sm:py-3 text-sm sm:text-base"
          onClick={() => window.location.href = '/signup'}
        >
          {t('common.createAccount', 'Create an account')}
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
