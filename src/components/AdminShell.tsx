import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, ShieldCheck, BarChart3, Heart, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

const NAV = [
  { to: "/admin/winners", label: "Winners", icon: ShieldCheck },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/charities", label: "Charities", icon: Heart },
] as const;

export function AdminShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const location = useLocation();
  return (
    <div className="min-h-screen">
      <div aria-hidden className="pointer-events-none fixed inset-0 grid-overlay" />
      <div className="relative mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col rounded-3xl glass-strong p-4 lg:flex">
          <Link to="/" className="mb-6 flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
          <div className="mb-4 flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary glow-emerald">
              <LayoutDashboard className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="font-display text-sm font-semibold tracking-tight">Admin Console</span>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active = location.pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
                >
                  {active && (
                    <motion.span
                      layoutId="admin-active-pill"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/10 ring-1 ring-primary/40 shadow-[0_0_30px_-8px_var(--emerald-glow)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className={`relative h-4 w-4 transition ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  <span className={`relative ${active ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto rounded-2xl glass p-3 text-xs text-muted-foreground">
            UI shell only. Connect Lovable Cloud to wire real data.
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <nav className="flex gap-2 lg:hidden">
              {NAV.map((item) => {
                const active = location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-xl px-3 py-1.5 text-xs ${active ? "bg-primary/20 text-foreground ring-1 ring-primary/40" : "glass text-muted-foreground"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
