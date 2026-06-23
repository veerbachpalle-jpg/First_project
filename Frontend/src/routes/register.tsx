import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ImageDropzone } from "@/components/common/ImageDropzone";
import { apiErrorMessage } from "@/services/api";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — VidoraHub" }] }),
  component: RegisterPage,
});

const schema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  username: z.string().trim().toLowerCase().min(1, "Username is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormValues = z.infer<typeof schema>;

function RegisterPage() {
  const { register: registerUser, login } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [show, setShow] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (v: FormValues) => {
    if (!avatar) { toast.error("Please upload an avatar"); return; }
    try {
      const fd = new FormData();
      fd.append("fullname", v.fullName);
      fd.append("username", v.username);
      fd.append("email", v.email);
      fd.append("password", v.password);
      fd.append("avatar", avatar);
      if (cover) fd.append("coverimage", cover);

      await registerUser(fd);
      await login({ email: v.email, password: v.password });
      toast.success("Account created!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(apiErrorMessage(err, "Registration failed"));
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong rounded-3xl p-8 shadow-elegant md:p-10"
        >
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back</Link>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Set up your creator profile in under a minute.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
              <ImageDropzone label="Avatar" aspect="square" required onFile={setAvatar} />
              <ImageDropzone label="Cover image" aspect="cover" onFile={setCover} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name" error={errors.fullName?.message}>
                <input {...register("fullName")} className="input" placeholder="Ada Lovelace" />
              </Field>
              <Field label="Username" error={errors.username?.message}>
                <input {...register("username")} className="input" placeholder="ada" />
              </Field>
              <Field label="Email" error={errors.email?.message}>
                <input type="email" {...register("email")} className="input" placeholder="you@email.com" />
              </Field>
              <Field label="Password" error={errors.password?.message}>
                <div className="relative">
                  <input type={show ? "text" : "password"} {...register("password")} className="input pr-10" placeholder="Your password" />
                  <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 font-semibold text-white shadow-glow transition hover:opacity-95 disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              Create account
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-foreground hover:gradient-text">Sign in</Link>
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
