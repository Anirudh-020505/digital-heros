import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { CHARITIES, CATEGORIES } from "@/data/charities";

export const Route = createFileRoute("/charities")({
  head: () => ({
    meta: [
      { title: "Charity Directory — Digital Heroes" },
      { name: "description", content: "Browse the charities powered by the Digital Heroes prize pool." },
      { property: "og:title", content: "Charity Directory — Digital Heroes" },
      { property: "og:description", content: "Education. Environment. Health. Choose where your impact lands." },
    ],
  }),
  component: CharitiesIndex,
});

function CharitiesIndex() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    return CHARITIES.filter((c) => {
      const matchesCat = active === "All" || c.category === active;
      const q = query.trim().toLowerCase();
      const matchesQ = !q || c.name.toLowerCase().includes(q) || c.cause.toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
  }, [query, active]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageTransition>
        <main className="relative pt-32 pb-24">
          <div aria-hidden className="absolute inset-0 grid-overlay" />
          <div className="relative mx-auto max-w-6xl px-5">
            <div className="mb-10 max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Heart className="h-3 w-3 text-primary" /> Charity directory
              </span>
              <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
                Where your <span className="text-gradient-emerald-cyan">impact</span> lands.
              </h1>
              <p className="mt-4 text-muted-foreground">
                Pick the cause that moves you. Every subscription routes a minimum of 10% directly to your chosen charity.
              </p>
            </div>

            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search charities…"
                  className="w-full rounded-2xl glass px-11 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = active === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActive(cat)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition ${
                        isActive
                          ? "bg-gradient-to-r from-primary/30 to-secondary/20 text-foreground ring-1 ring-primary/60 shadow-[0_0_30px_-8px_var(--emerald-glow)]"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c, i) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-3xl glass-strong p-6 float-shadow"
                >
                  <div className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${c.heroGradient} blur-3xl opacity-60 transition group-hover:opacity-90`} />
                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{c.category}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold">{c.name}</h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                    <div className="mt-6 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Raised to date</p>
                        <p className="font-display text-2xl font-semibold text-gradient-emerald-cyan">{c.raised}</p>
                      </div>
                      <Link
                        to="/charities/$id"
                        params={{ id: c.id }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-background shadow-[0_0_30px_-8px_var(--emerald-glow)] transition hover:brightness-110"
                      >
                        View Impact <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full rounded-3xl glass p-12 text-center text-muted-foreground">
                  No charities match your filters.
                </div>
              )}
            </div>
          </div>
        </main>
      </PageTransition>
      <SiteFooter />
    </div>
  );
}
