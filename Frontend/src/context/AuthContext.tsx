import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authService, type User } from "@/services/auth.service";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (payload: { email?: string; username?: string; password: string }) => Promise<User>;
  register: (form: FormData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (u: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const u = await authService.getCurrentUser();
    setUser(u);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await authService.getCurrentUser();
        if (mounted) setUser(u);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback<AuthContextValue["login"]>(async (payload) => {
    const u = await authService.login(payload);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (form: FormData) => {
    await authService.register(form);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh, setUser }),
    [user, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
