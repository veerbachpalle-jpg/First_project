import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Calendar, Mail, Pencil, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — VidoraHub" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.username) return;
    let mounted = true;
    userService.getChannelProfile(user.username)
      .then((data) => {
        if (mounted) {
          setProfile(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [user?.username]);

  if (!user) return null;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass overflow-hidden rounded-3xl shadow-elegant"
      >
        <div className="relative h-52 w-full md:h-64">
          {user.coverImage ? (
            <img src={user.coverImage} alt="cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-primary/40 via-accent/30 to-primary/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        <div className="-mt-16 px-6 pb-8 md:px-10">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-5">
              <img
                src={user.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user.username}`}
                alt={user.username}
                className="h-32 w-32 rounded-full border-4 border-background object-cover shadow-elegant"
              />
              <div className="pb-2">
                <h1 className="text-2xl font-bold md:text-3xl">{user.fullName}</h1>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
              </div>
            </div>
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              <Pencil className="h-4 w-4" /> Edit profile
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
              <Mail className="h-3.5 w-3.5" /> {user.email}
            </span>
            {user.createdAt && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Creator
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Videos", value: loading ? "..." : (profile?.videosCount ?? 0).toLocaleString() },
          { label: "Subscribers", value: loading ? "..." : (profile?.subscriberscount ?? 0).toLocaleString() },
          { label: "Total views", value: loading ? "..." : (profile?.totalViews ?? 0).toLocaleString() },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
            <div className="mt-2 text-2xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <h3 className="font-semibold">About</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This is your public profile. Update your avatar, cover image, and account details from settings.
        </p>
      </div>
    </div>
  );
}
