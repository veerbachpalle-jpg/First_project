import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LogOut, Menu, Play, Settings, User as UserIcon, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out");
      navigate({ to: "/" });
    } catch {
      toast.error("Logout failed");
    }
  };

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/profile", label: "Profile" },
        { to: "/settings", label: "Settings" },
      ]
    : [{ to: "/", label: "Home" }];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow transition-transform group-hover:scale-105">
            <Play className="h-4 w-4 fill-white text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Vidora{"\u00a0"}<span className="gradient-text">Hub</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname === l.to
                  ? "bg-white/5 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pr-3 hover:bg-white/10 transition"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                  alt={user.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{user.username}</span>
              </button>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-strong absolute right-0 mt-2 w-52 overflow-hidden rounded-xl py-1 shadow-elegant"
                >
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5">
                    <UserIcon className="h-4 w-4" /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/5">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <div className="my-1 h-px bg-white/5" />
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-white/5">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((o) => !o)} className="md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-white/5 md:hidden"
        >
          <div className="space-y-1 px-6 py-4">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-white/5" />
            {user ? (
              <button onClick={handleLogout} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-destructive hover:bg-white/5">
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 text-sm hover:bg-white/5">Sign in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Get started</Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
