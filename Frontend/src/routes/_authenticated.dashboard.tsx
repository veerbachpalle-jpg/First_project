import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  Heart,
  PlayCircle,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { userService } from "@/services/user.service";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — VidoraHub" }] }),
  component: Dashboard,
});

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

const activity = [
  { title: "New subscriber milestone reached", time: "2 hours ago", tag: "Growth" },
  { title: "Video 'Behind the scenes' trending", time: "5 hours ago", tag: "Content" },
  { title: "Comment from @maya_creates", time: "Yesterday", tag: "Community" },
  { title: "Monthly payout processed", time: "2 days ago", tag: "Payments" },
];

function Dashboard() {
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

  const totalViews = profile?.totalViews ?? 0;
  const subscribers = profile?.subscriberscount ?? 0;
  const watchTimeHours = totalViews * 0.15; // 9 mins average watch time per view

  const statsList = [
    { label: "Total views", value: loading ? "..." : formatNumber(totalViews), trend: totalViews > 0 ? "+12.4%" : "0.0%", icon: Eye },
    { label: "Subscribers", value: loading ? "..." : subscribers.toLocaleString(), trend: subscribers > 0 ? "+3.2%" : "0.0%", icon: Users },
    { label: "Watch time", value: loading ? "..." : `${watchTimeHours.toLocaleString(undefined, { maximumFractionDigits: 1 })} hrs`, trend: totalViews > 0 ? "+8.1%" : "0.0%", icon: PlayCircle },
    { label: "Engagement", value: loading ? "..." : (totalViews > 0 ? "78.4%" : "0.0%"), trend: totalViews > 0 ? "+1.6%" : "0.0%", icon: Heart },
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Hey, <span className="gradient-text">{user?.fullName?.split(" ")[0] ?? user?.username}</span> 👋
          </h1>
        </div>
        <Link
          to="/settings"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
        >
          Manage account <ArrowUpRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsList.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -3 }}
            className="glass relative overflow-hidden rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs text-success">{s.trend}</span>
            </div>
            <div className="mt-4 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Profile + activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass overflow-hidden rounded-2xl lg:col-span-1"
        >
          <div className="relative h-28 w-full overflow-hidden">
            {user?.coverImage ? (
              <img src={user.coverImage} alt="cover" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-primary/40 to-accent/40" />
            )}
          </div>
          <div className="-mt-10 px-6 pb-6">
            <img
              src={user?.avatar || `https://api.dicebear.com/9.x/initials/svg?seed=${user?.username}`}
              alt={user?.username}
              className="h-20 w-20 rounded-full border-4 border-background object-cover shadow-card"
            />
            <h3 className="mt-3 text-lg font-semibold">{user?.fullName}</h3>
            <p className="text-sm text-muted-foreground">@{user?.username}</p>
            <p className="mt-1 text-xs text-muted-foreground">{user?.email}</p>
            <Link
              to="/profile"
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              View profile
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">Audience growth</h3>
            <span className="inline-flex items-center gap-1 text-xs text-success">
              <TrendingUp className="h-3.5 w-3.5" /> +18% this month
            </span>
          </div>
          <div className="relative h-48 w-full overflow-hidden rounded-xl">
            <svg viewBox="0 0 400 160" className="h-full w-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.22 18)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="oklch(0.7 0.22 18)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,120 C40,100 80,70 120,80 C160,90 200,40 240,50 C280,60 320,30 360,20 L400,20 L400,160 L0,160 Z" fill="url(#g)" />
              <path d="M0,120 C40,100 80,70 120,80 C160,90 200,40 240,50 C280,60 320,30 360,20 L400,20" stroke="oklch(0.78 0.2 25)" strokeWidth="2.5" fill="none" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Activity */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Recent activity</h3>
          <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
        </div>
        <ul className="divide-y divide-white/5">
          {activity.map((a) => (
            <li key={a.title} className="flex items-center gap-4 py-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5">
                <Video className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
              <span className="hidden rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted-foreground sm:inline">
                {a.tag}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
