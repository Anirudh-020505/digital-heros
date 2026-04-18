import { motion } from "framer-motion";
import { Heart, ArrowUpRight } from "lucide-react";

const charities = [
  {
    name: "Ocean Reach",
    cause: "Marine conservation",
    raised: "£128,420",
    accent: "from-secondary to-primary",
  },
  {
    name: "Mind Forward",
    cause: "Youth mental health",
    raised: "£94,180",
    accent: "from-primary to-secondary",
  },
  {
    name: "BrightPath",
    cause: "Education access",
    raised: "£71,902",
    accent: "from-secondary to-primary",
  },
];

export function CharitySpotlight() {
  return (
    <section id="charities" className="relative mx-auto max-w-6xl px-5 py-24">
      <div className="mb-12 max-w-2xl">
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Heart className="h-3 w-3 text-primary" /> Featured impact
        </span>
        <h2 className="mt-5 font-display text-4xl font-semibold md:text-5xl">
          Every round funds a{" "}
          <span className="text-gradient-emerald-cyan">cause that matters</span>.
        </h2>
        <p className="mt-4 text-muted-foreground">
          A minimum of 10% of every subscription is routed directly to your chosen
          charity. Track the impact in real time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {charities.map((c, i) => (
          <motion.article
            key={c.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-3xl glass-strong p-6 float-shadow"
          >
            <div
              className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${c.accent} opacity-30 blur-3xl transition group-hover:opacity-60`}
            />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {c.cause}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{c.name}</h3>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Raised to date</p>
                  <p className="font-display text-3xl font-semibold text-gradient-emerald-cyan">
                    {c.raised}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full glass transition group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
