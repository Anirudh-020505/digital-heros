import { motion } from "framer-motion";

const split = [
  { place: "1st", pct: 40, glow: "var(--emerald-glow)" },
  { place: "2nd", pct: 35, glow: "var(--cyan-glow)" },
  { place: "3rd", pct: 25, glow: "var(--emerald-glow)" },
];

export function PrizePool() {
  return (
    <section id="impact" className="relative mx-auto max-w-6xl px-5 py-24">
      <div className="rounded-[2rem] glass-strong p-10 md:p-14 float-shadow overflow-hidden relative">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "color-mix(in oklab, var(--emerald-glow) 35%, transparent)" }}
        />
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Live prize pool
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold md:text-5xl">
              <span className="text-gradient-emerald-cyan">40 / 35 / 25</span>{" "}
              distribution.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              The pool is computed from active subscriptions each cycle, less the
              charity contribution. Winners verify with photo proof; admins
              approve payouts.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {split.map((s, i) => (
              <motion.div
                key={s.place}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative rounded-2xl glass p-5 text-center"
                style={{ boxShadow: `0 0 40px -15px ${s.glow}` }}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {s.place}
                </p>
                <p className="mt-3 font-display text-4xl font-semibold text-gradient-emerald-cyan">
                  {s.pct}%
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
