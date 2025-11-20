import { useEffect, useState } from "react";
import { getAuth, onIdTokenChanged } from "firebase/auth";
import firebaseApp from "@/lib/firebase";

export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [claimsChecked, setClaimsChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setClaimsChecked(true);
        return;
      }

      try {
        const tokenResult = await user.getIdTokenResult();
        setIsAdmin(Boolean(tokenResult.claims?.admin));
      } catch {
        setIsAdmin(false);
      } finally {
        setClaimsChecked(true);
      }
    });

    return unsubscribe;
  }, []);

  return { isAdmin, claimsChecked };
}
