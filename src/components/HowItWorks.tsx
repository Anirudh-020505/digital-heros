import { motion } from "framer-motion";
import { ChartLine, Trophy, HandHeart } from "lucide-react";

const steps = [
  {
    icon: ChartLine,
    title: "Log your rolling 5",
    body: "Submit Stableford scores (1-45). We retain only your latest five — one per date.",
  },
  {
    icon: Trophy,
    title: "Enter the prize draw",
    body: "Active subscribers compete in a 40 / 35 / 25 distribution pool every cycle.",
  },
  {
    icon: HandHeart,
    title: "Fund real impact",
    body: "10%+ of every subscription is routed to the charity you select at signup.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative mx-auto max-w-6xl px-5 py-24">
      <div className="mb-14 flex items-end justify-between gap-8">
        <h2 className="max-w-xl font-display text-4xl font-semibold md:text-5xl">
          A modern engine for{" "}
          <span className="text-gradient-emerald-cyan">performance + purpose</span>.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="relative rounded-3xl glass p-7"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-white/10">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            <div className="mt-6 font-mono text-xs text-muted-foreground/60">
              0{i + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
