import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { CHARITIES } from "@/data/charities";

export const Route = createFileRoute("/charities/$id")({
  loader: ({ params }) => {
    const charity = CHARITIES.find((c) => c.id === params.id);
    if (!charity) throw notFound();
    return charity;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Digital Heroes` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — Digital Heroes` },
          { property: "og:description", content: loaderData.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-4xl">Charity not found</h1>
        <Link to="/charities" className="mt-4 inline-block text-primary">Back to directory</Link>
      </div>
    </div>
  ),
  component: CharityProfile,
});

function CharityProfile() {
  const charity = Route.useLoaderData();
  const [amount, setAmount] = useState(25);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <PageTransition>
        <main className="relative pb-24 pt-24">
          {/* Cinematic header */}
          <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${charity.heroGradient}`} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_85%)]" />
            <div aria-hidden className="absolute inset-0 grid-overlay opacity-50" />

            <div className="relative mx-auto flex h-full max-w-6xl items-end px-5 pb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl rounded-3xl glass-strong p-7 float-shadow"
              >
                <Link
                  to="/charities"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground"
                >
                  <ArrowLeft className="h-3 w-3" /> All charities
                </Link>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-primary">{charity.category}</p>
                <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
                  {charity.name}
                </h1>
                <p className="mt-4 text-base text-muted-foreground">{charity.mission}</p>
                <div className="mt-6 flex items-end gap-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Raised to date</p>
                    <p className="font-display text-3xl font-semibold text-gradient-emerald-cyan">{charity.raised}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">This month</p>
                    <p className="font-display text-3xl font-semibold">+£{Math.floor(charity.raisedNum * 0.04).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="relative mx-auto mt-12 grid max-w-6xl gap-8 px-5 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="rounded-3xl glass-strong p-7">
                <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
                  <Sparkles className="h-5 w-5 text-primary" /> Upcoming events
                </h2>
                <ul className="mt-6 space-y-3">
                  {charity.events.map((ev: { title: string; date: string; location: string }) => (
                    <li
                      key={ev.title}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl glass px-5 py-4 transition hover:bg-white/10"
                    >
                      <div>
                        <p className="font-medium text-foreground">{ev.title}</p>
                        <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {ev.date}</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {ev.location}</span>
                        </p>
                      </div>
                      <button className="rounded-full glass px-3 py-1.5 text-xs text-foreground transition hover:bg-white/15">
                        Register interest
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 rounded-3xl glass-strong p-7">
                <h2 className="font-display text-2xl font-semibold">The impact, in numbers</h2>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[
                    { k: "12,420", v: "Lives touched" },
                    { k: "182", v: "Programmes funded" },
                    { k: "94%", v: "Direct to cause" },
                  ].map((s) => (
                    <div key={s.v} className="rounded-2xl glass p-5">
                      <p className="font-display text-2xl font-semibold text-gradient-emerald-cyan">{s.k}</p>
                      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating direct donation widget */}
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="sticky top-28 self-start rounded-3xl glass-strong p-6 float-shadow"
            >
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary glow-emerald">
                  <Heart className="h-4 w-4 text-background" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Direct donation</p>
                  <p className="font-display text-lg font-semibold">100% to {charity.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    className={`rounded-xl px-2 py-2.5 text-sm font-semibold transition ${
                      amount === v
                        ? "bg-gradient-to-r from-primary/30 to-secondary/20 ring-1 ring-primary/60 text-foreground shadow-[0_0_24px_-8px_var(--emerald-glow)]"
                        : "glass text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    £{v}
                  </button>
                ))}
              </div>

              <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">Custom amount</label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl glass px-4 py-3">
                <span className="text-muted-foreground">£</span>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full bg-transparent text-foreground focus:outline-none"
                />
              </div>

              <button
                onClick={() => toast.success(`Thank you — £${amount} pledged to ${charity.name}.`)}
                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3.5 text-sm font-semibold text-background shadow-[0_0_40px_-10px_var(--emerald-glow)] transition hover:brightness-110"
              >
                Donate £{amount}
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Demo only — payments aren't connected yet.
              </p>
            </motion.aside>
          </section>
        </main>
      </PageTransition>
      <SiteFooter />
    </div>
  );
}
