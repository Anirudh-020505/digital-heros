import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3 glass">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary glow-emerald">
            <Trophy className="h-5 w-5 text-background" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            Digital<span className="text-gradient-emerald-cyan">Heroes</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="/#impact" className="transition hover:text-foreground">Impact</a>
          <a href="/#how" className="transition hover:text-foreground">How it works</a>
          <Link to="/charities" className="transition hover:text-foreground" activeProps={{ className: "text-foreground" }}>Charities</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-semibold text-background shadow-[0_0_30px_-8px_var(--emerald-glow)] transition hover:brightness-110"
          >
            Join the league
          </Link>
        </div>
      </div>
    </header>
  );
}
