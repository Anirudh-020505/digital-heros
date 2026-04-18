import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Coins, Heart, Users, TrendingUp } from "lucide-react";
import { AdminShell } from "@/components/AdminShell";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — Admin" },
      { name: "description", content: "Prize pool, charity contributions and subscriber metrics." },
    ],
  }),
  component: AdminReports,
});

const sparkline = [12, 18, 14, 22, 26, 24, 32, 28, 36, 42, 38, 48];

function Sparkline({ data, color = "var(--emerald-glow)" }: { data: number[]; color?: string }) {
  const w = 200;
  const h = 50;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-12 w-full">
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,${h} ${points} ${w},${h}`} fill="url(#sparkFill)" />
    </svg>
  );
}

function StatOrb({
  icon: Icon,
  label,
  value,
  delta,
  delay = 0,
  showSpark = false,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  delta: string;
  delay?: number;
  showSpark?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-3xl glass-strong p-6 float-shadow"
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/40 to-secondary/30 opacity-50 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-secondary/20 ring-1 ring-white/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary ring-1 ring-primary/30">
            <TrendingUp className="h-3 w-3" /> {delta}
          </span>
        </div>
        <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-4xl font-semibold text-gradient-emerald-cyan">{value}</p>
        {showSpark && (
          <div className="mt-3">
            <Sparkline data={sparkline} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

const DRAWS = [
  { id: "d12", month: "March 2026", winners: 7, pool: "£42,500", rollover: "£0", state: "Settled" },
  { id: "d11", month: "February 2026", winners: 5, pool: "£38,200", rollover: "£4,300", state: "Settled" },
  { id: "d10", month: "January 2026", winners: 0, pool: "£31,800", rollover: "£31,800", state: "Rolled over" },
  { id: "d09", month: "December 2025", winners: 6, pool: "£36,900", rollover: "£0", state: "Settled" },
  { id: "d08", month: "November 2025", winners: 4, pool: "£29,400", rollover: "£2,100", state: "Settled" },
];

function AdminReports() {
  return (
    <AdminShell title="Reports & Analytics" subtitle="Live snapshot of league performance and impact.">
      <PageTransition>
        <div className="grid gap-4 md:grid-cols-3">
          <StatOrb icon={Coins} label="Total Prize Pool" value="£128,400" delta="+12.4%" showSpark delay={0} />
          <StatOrb icon={Heart} label="Charity Contributions" value="£86,720" delta="+8.1%" delay={0.05} />
          <StatOrb icon={Users} label="Active Subscribers" value="12,840" delta="+4.6%" delay={0.1} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-6 rounded-3xl glass-strong p-6"
        >
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Draw history</h2>
              <p className="text-sm text-muted-foreground">Past months, winner counts and jackpot rollover.</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl glass">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Draw</th>
                  <th className="px-5 py-3 font-medium">Winners</th>
                  <th className="px-5 py-3 font-medium">Pool</th>
                  <th className="px-5 py-3 font-medium">Rollover</th>
                  <th className="px-5 py-3 font-medium">State</th>
                </tr>
              </thead>
              <tbody>
                {DRAWS.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 transition last:border-0 hover:bg-white/5">
                    <td className="px-5 py-4 font-medium">{d.month}</td>
                    <td className="px-5 py-4 text-muted-foreground">{d.winners}</td>
                    <td className="px-5 py-4 font-display text-base text-gradient-emerald-cyan">{d.pool}</td>
                    <td className="px-5 py-4 text-muted-foreground">{d.rollover}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest ${
                          d.state === "Rolled over"
                            ? "bg-secondary/15 text-secondary ring-1 ring-secondary/40"
                            : "bg-primary/15 text-primary ring-1 ring-primary/40"
                        }`}
                      >
                        {d.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </PageTransition>
    </AdminShell>
  );
}
