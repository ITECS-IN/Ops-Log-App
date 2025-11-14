import { useEffect, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function LoginRedirectIfAuthenticated({ children }: { children: ReactNode }) {
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.replace('/dashboard');
      }
    });
    return () => unsub();
  }, []);
  return <>{children}</>;
}