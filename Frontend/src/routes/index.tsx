import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Layers,
  Sparkles,
  Video,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VidoraHub — The platform built for creators" },
      { name: "description", content: "Beautiful dashboards, powerful analytics, and a community-first publishing experience for modern creators." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: Video, title: "Pro-grade publishing", desc: "Upload, schedule, and showcase your work with cinematic detail pages." },
  { icon: BarChart3, title: "Live analytics", desc: "Realtime watch time, engagement, and audience growth charts." },
  { icon: Users, title: "Community-first", desc: "Subscriptions, comments, and superfan tools designed for retention." },
  { icon: Zap, title: "Lightning fast", desc: "Optimized delivery with adaptive streams and global CDN-ready assets." },
  { icon: Shield, title: "Built-in security", desc: "Role-based access, encrypted tokens, and seamless session refresh." },
  { icon: Sparkles, title: "Beautiful by default", desc: "A premium UI inspired by Linear, Vercel, and YouTube Studio." },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 text-center md:pt-32 md:pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            New — Creator Vidora HUB{"\u00a0"} is live
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl"
          >
            The premium platform <br className="hidden md:block" />
            <span className="gradient-text">built for creators.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            Publish, grow, and monetize your content with a stunning studio
            crafted to look as good as the work you make.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]"
            >
              Start creating
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold backdrop-blur hover:bg-white/10"
            >
              Sign in
            </Link>
          </motion.div>

          {/* Mock dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="relative mx-auto mt-20 max-w-5xl"
          >
            <div className="glass-strong overflow-hidden rounded-3xl border border-white/10 shadow-elegant">
              <div className="relative flex h-12 items-center justify-between border-b border-white/5 px-4">
                <div className="flex items-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute h-4 w-4 rounded-full bg-accent/20 blur-md" />
                    <Layers className="relative h-5 w-5 text-accent" strokeWidth={2.5} />
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Creator Hub
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-success" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                    Live
                  </span>
                </div>
              </div>
              <div className="grid gap-4 p-6 md:grid-cols-3">
                {[
                  { label: "Views", value: "1.24M", trend: "+18.4%" },
                  { label: "Watch time", value: "82k hrs", trend: "+12.1%" },
                  { label: "Subscribers", value: "94.2k", trend: "+4.8%" },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-5 text-left">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
                    <div className="mt-2 text-3xl font-bold">{s.value}</div>
                    <div className="mt-1 text-xs text-success">{s.trend} this week</div>
                  </div>
                ))}
                <div className="md:col-span-3 glass rounded-2xl p-5">
                  <div className="h-32 w-full rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need, <span className="gradient-text">nothing you don't.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete creator studio with thoughtful defaults and zero-config polish.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="glass group rounded-2xl p-6 transition-all hover:border-primary/30 hover:shadow-glow"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 transition-transform group-hover:scale-110">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="glass-strong relative overflow-hidden rounded-3xl p-12 text-center shadow-elegant">
          <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
          <h2 className="text-3xl font-bold md:text-4xl">Your audience is waiting.</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Join thousands of creators already growing on Vidora Hub.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white shadow-glow"
          >
            Create your account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
