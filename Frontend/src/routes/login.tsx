import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiErrorMessage } from "@/services/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — VidoraHub" }] }),
  component: LoginPage,
});

const schema = z.object({
  identifier: z.string().min(1, "Enter your username or email"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});
type FormValues = z.infer<typeof schema>;

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: FormValues) => {
    try {
      const isEmail = v.identifier.includes("@");
      await login({
        password: v.password,
        ...(isEmail ? { email: v.identifier } : { username: v.identifier.toLowerCase() }),
      });
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Invalid credentials"));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto flex min-h-screen max-w-md items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-strong w-full rounded-3xl p-8 shadow-elegant"
        >
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back</Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue creating.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Field label="Username or email" error={errors.identifier?.message}>
              <input
                {...register("identifier")}
                placeholder="you@email.com"
                className="input"
                autoComplete="username"
              />
            </Field>

            <Field label="Password" error={errors.password?.message}>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className="input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
              <input type="checkbox" {...register("remember")} className="h-4 w-4 rounded border-white/20 bg-white/5 accent-[color:var(--primary)]" />
              Remember me
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign in
            </button>

            <p className="text-center text-sm text-muted-foreground">
              No account?{" "}
              <Link to="/register" className="font-medium text-foreground hover:gradient-text">Create one</Link>
            </p>
          </form>
        </motion.div>
      </div>

      <style>{`
        .input { width:100%; border-radius:0.75rem; background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:0.7rem 0.9rem; font-size:0.9rem; color:white; outline:none; transition: all .2s; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--ring); background: rgba(255,255,255,0.06); }
        .input::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
