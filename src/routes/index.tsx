import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { GlassSphere } from "@/components/GlassSphere";
import { CharitySpotlight } from "@/components/CharitySpotlight";
import { HowItWorks } from "@/components/HowItWorks";
import { PrizePool } from "@/components/PrizePool";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Digital Heroes — Performance with purpose" },
      {
        name: "description",
        content:
          "A premium golf performance league where every score funds real charitable impact. Rolling 5 scoring, prize pools, real change.",
      },
      { property: "og:title", content: "Digital Heroes — Performance with purpose" },
      {
        property: "og:description",
        content:
          "Premium golf performance & charity reward platform. Modern. Glassy. Impactful.",
      },
    ],
  }),
  component: Index,
});

function Hero() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div aria-hidden className="absolute inset-0 grid-overlay" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            <Sparkles className="h-3 w-3 text-primary" />
            New season open
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
          >
            Play for{" "}
            <span className="text-gradient-emerald-cyan">prizes</span>.
            <br />
            Win for{" "}
            <span className="text-gradient-emerald-cyan">people</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-lg text-lg text-muted-foreground"
          >
            A subscription-powered performance league. Submit your rolling 5
            Stableford scores, enter the prize pool, and route at least 10% of
            every payment to a charity you choose.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-3.5 font-semibold text-background shadow-[0_0_50px_-10px_var(--emerald-glow)] transition hover:brightness-110"
            >
              Start your subscription
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <a
              href="#how"
              className="rounded-2xl glass px-6 py-3.5 text-sm font-medium text-foreground transition hover:bg-white/10"
            >
              How it works
            </a>
          </motion.div>

          <div className="mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              { k: "12,840", v: "Active heroes" },
              { k: "£2.1M", v: "Raised" },
              { k: "47", v: "Charities" },
            ].map((s) => (
              <div key={s.v}>
                <p className="font-display text-2xl font-semibold text-gradient-emerald-cyan">
                  {s.k}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                  {s.v}
                </p>
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <GlassSphere />
        </motion.div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <CharitySpotlight />
        <HowItWorks />
        <PrizePool />
      </main>
      <SiteFooter />
    </div>
  );
}
