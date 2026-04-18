import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Check, Heart } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join Digital Heroes — Subscribe & choose your cause" },
      {
        name: "description",
        content:
          "Pick a plan, choose your charity (10% minimum contribution), and join the league.",
      },
      { property: "og:title", content: "Join Digital Heroes" },
      {
        property: "og:description",
        content: "Performance with purpose — subscribe and choose your cause.",
      },
    ],
  }),
  component: SignupPage,
});

type Plan = {
  id: "monthly" | "yearly";
  name: string;
  price: string;
  cadence: string;
  badge?: string;
  perks: string[];
};

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "£12",
    cadence: "/month",
    perks: ["Rolling 5 dashboard", "Prize draw entry", "Cancel anytime"],
  },
  {
    id: "yearly",
    name: "Yearly",
    price: "£108",
    cadence: "/year",
    badge: "Save 25%",
    perks: ["Everything in Monthly", "Priority verification", "Annual hero badge"],
  },
];

const charities = [
  { id: "ocean", name: "Ocean Reach", cause: "Marine conservation" },
  { id: "mind", name: "Mind Forward", cause: "Youth mental health" },
  { id: "bright", name: "BrightPath", cause: "Education access" },
  { id: "vets", name: "Veterans United", cause: "Veteran support" },
  { id: "rescue", name: "Paws Rescue", cause: "Animal welfare" },
  { id: "feed", name: "Feed The City", cause: "Food security" },
];

function SignupPage() {
  const [plan, setPlan] = useState<Plan["id"]>("yearly");
  const [charityId, setCharityId] = useState<string | null>(null);
  const [contribution, setContribution] = useState(15);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = !!charityId && contribution >= 10 && email && name;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-24">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-5 pt-32">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <h1 className="font-display text-4xl font-semibold md:text-5xl">
            Join the <span className="text-gradient-emerald-cyan">league</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Choose your plan and the cause your subscription will support.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 rounded-3xl glass-strong p-10 text-center float-shadow"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary glow-emerald">
              <Check className="h-7 w-7 text-background" strokeWidth={3} />
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold">
              Welcome, hero.
            </h2>
            <p className="mt-3 text-muted-foreground">
              This is a UI preview — connect Lovable Cloud to enable real
              accounts, payments, and your dashboard.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            {/* Plans */}
            <section className="rounded-3xl glass-strong p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold">1. Choose a plan</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {plans.map((p) => {
                  const active = plan === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setPlan(p.id)}
                      className={`relative rounded-2xl border p-6 text-left transition ${
                        active
                          ? "border-transparent bg-white/10 glow-emerald"
                          : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                      }`}
                    >
                      {p.badge && (
                        <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-primary to-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
                          {p.badge}
                        </span>
                      )}
                      <p className="font-display text-lg font-semibold">{p.name}</p>
                      <p className="mt-1">
                        <span className="font-display text-3xl font-semibold text-gradient-emerald-cyan">
                          {p.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {p.cadence}
                        </span>
                      </p>
                      <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                        {p.perks.map((perk) => (
                          <li key={perk} className="flex items-start gap-2">
                            <Check className="mt-0.5 h-3.5 w-3.5 text-primary" />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Charity */}
            <section className="rounded-3xl glass-strong p-6 md:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">
                  2. Choose your charity
                </h2>
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3 text-primary" /> Required
                </span>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {charities.map((c) => {
                  const active = charityId === c.id;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCharityId(c.id)}
                      className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-transparent bg-white/10 glow-cyan"
                          : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.cause}</p>
                      </div>
                      {active && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary">
                          <Check className="h-3.5 w-3.5 text-background" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">
                    Contribution from your subscription
                  </label>
                  <span className="font-display text-2xl font-semibold text-gradient-emerald-cyan">
                    {contribution}%
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={50}
                  value={contribution}
                  onChange={(e) => setContribution(Number(e.target.value))}
                  className="mt-3 w-full accent-[var(--emerald-glow)]"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Minimum 10%. The rest funds the prize pool & operations.
                </p>
              </div>
            </section>

            {/* Account */}
            <section className="rounded-3xl glass-strong p-6 md:p-8">
              <h2 className="font-display text-xl font-semibold">
                3. Create your account
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none transition focus:border-primary/60 focus:bg-white/[0.07]"
                    placeholder="Jane Hero"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none transition focus:border-primary/60 focus:bg-white/[0.07]"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-4 font-semibold text-background transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:brightness-110 enabled:shadow-[0_0_50px_-10px_var(--emerald-glow)]"
            >
              {canSubmit
                ? `Start ${plan === "yearly" ? "yearly" : "monthly"} subscription`
                : "Complete all steps to continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
