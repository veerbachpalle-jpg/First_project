import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LogOut, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { ImageDropzone } from "@/components/common/ImageDropzone";
import { userService } from "@/services/user.service";
import { apiErrorMessage } from "@/services/api";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — VidoraHub" }] }),
  component: SettingsPage,
});

const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(80),
  email: z.string().trim().email("Enter a valid email"),
});
type ProfileVals = z.infer<typeof profileSchema>;

const passSchema = z
  .object({
    oldPassword: z.string().min(6, "Required"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, { path: ["confirm"], message: "Passwords don't match" });
type PassVals = z.infer<typeof passSchema>;

function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const profileForm = useForm<ProfileVals>({
    resolver: zodResolver(profileSchema),
    defaultValues: { fullName: user?.fullName ?? "", email: user?.email ?? "" },
  });

  const passwordForm = useForm<PassVals>({ resolver: zodResolver(passSchema) });

  const [savingAvatar, setSavingAvatar] = useState(false);
  const [savingCover, setSavingCover] = useState(false);

  const onProfile = async (v: ProfileVals) => {
    try {
      const updated = await userService.updateAccount(v);
      setUser(updated);
      toast.success("Profile updated");
    } catch (e) { toast.error(apiErrorMessage(e)); }
  };

  const onPassword = async (v: PassVals) => {
    try {
      await userService.changePassword({ oldPassword: v.oldPassword, newPassword: v.newPassword });
      passwordForm.reset();
      toast.success("Password changed");
    } catch (e) { toast.error(apiErrorMessage(e)); }
  };

  const onAvatar = async (file: File | null) => {
    if (!file) return;
    setSavingAvatar(true);
    try {
      const updated = await userService.updateAvatar(file);
      setUser(updated);
      toast.success("Avatar updated");
    } catch (e) { toast.error(apiErrorMessage(e)); }
    finally { setSavingAvatar(false); }
  };

  const onCover = async (file: File | null) => {
    if (!file) return;
    setSavingCover(true);
    try {
      const updated = await userService.updateCover(file);
      setUser(updated);
      toast.success("Cover updated");
    } catch (e) { toast.error(apiErrorMessage(e)); }
    finally { setSavingCover(false); }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Account settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, security, and account.</p>
      </motion.div>

      <Section title="Profile" desc="Update your public information.">
        <form onSubmit={profileForm.handleSubmit(onProfile)} className="grid gap-4 md:grid-cols-2">
          <Field label="Full name" error={profileForm.formState.errors.fullName?.message}>
            <input {...profileForm.register("fullName")} className="input" />
          </Field>
          <Field label="Email" error={profileForm.formState.errors.email?.message}>
            <input type="email" {...profileForm.register("email")} className="input" />
          </Field>
          <div className="md:col-span-2">
            <button type="submit" disabled={profileForm.formState.isSubmitting} className="btn-primary">
              {profileForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save changes
            </button>
          </div>
        </form>
      </Section>

      <Section title="Avatar & cover" desc="Refresh your visual identity.">
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <div className="relative">
            <ImageDropzone label="Avatar" aspect="square" onFile={onAvatar} initialUrl={user?.avatar} />
            {savingAvatar && <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin text-primary" />}
          </div>
          <div className="relative">
            <ImageDropzone label="Cover image" aspect="cover" onFile={onCover} initialUrl={user?.coverImage} />
            {savingCover && <Loader2 className="absolute right-3 top-9 h-4 w-4 animate-spin text-primary" />}
          </div>
        </div>
      </Section>

      <Section title="Security" desc="Change your password regularly.">
        <form onSubmit={passwordForm.handleSubmit(onPassword)} className="grid gap-4 md:grid-cols-2">
          <Field label="Current password" error={passwordForm.formState.errors.oldPassword?.message}>
            <input type="password" {...passwordForm.register("oldPassword")} className="input" />
          </Field>
          <div />
          <Field label="New password" error={passwordForm.formState.errors.newPassword?.message}>
            <input type="password" {...passwordForm.register("newPassword")} className="input" />
          </Field>
          <Field label="Confirm new password" error={passwordForm.formState.errors.confirm?.message}>
            <input type="password" {...passwordForm.register("confirm")} className="input" />
          </Field>
          <div className="md:col-span-2">
            <button type="submit" disabled={passwordForm.formState.isSubmitting} className="btn-primary">
              {passwordForm.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Update password
            </button>
          </div>
        </form>
      </Section>

      <Section title="Account" desc="Manage session and account state." danger>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <button
            onClick={() => toast.info("Contact support to delete your account.")}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4" /> Delete account
          </button>
        </div>
      </Section>

      <style>{`
        .input { width:100%; border-radius:0.75rem; background: rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:0.7rem 0.9rem; font-size:0.9rem; color:white; outline:none; transition: all .2s; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--ring); background: rgba(255,255,255,0.06); }
        .btn-primary { display:inline-flex; align-items:center; gap:0.5rem; border-radius:0.75rem; background: linear-gradient(135deg, var(--primary), var(--accent)); padding: 0.65rem 1.1rem; font-size:0.875rem; font-weight:600; color:white; box-shadow: var(--shadow-glow); }
        .btn-primary:disabled { opacity: 0.6; }
      `}</style>
    </div>
  );
}

function Section({ title, desc, children, danger }: { title: string; desc?: string; children: React.ReactNode; danger?: boolean }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass rounded-2xl p-6 ${danger ? "border-destructive/20" : ""}`}
    >
      <div className="mb-5">
        <h2 className="font-semibold">{title}</h2>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </div>
      {children}
    </motion.section>
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
