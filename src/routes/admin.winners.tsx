import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Eye, Trophy, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell } from "@/components/AdminShell";
import { PageTransition } from "@/components/PageTransition";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/winners")({
  head: () => ({
    meta: [
      { title: "Winner Verification — Admin" },
      { name: "description", content: "Review and approve winner proofs for payout." },
    ],
  }),
  component: AdminWinners,
});

type Status = "pending" | "paid" | "rejected";
type Winner = {
  id: string;
  name: string;
  handle: string;
  draw: string;
  prize: string;
  submitted: string;
  proof: string;
  status: Status;
};

const SEED: Winner[] = [
  { id: "w1", name: "Liam Carter", handle: "@liamc", draw: "Mar Rolling 5", prize: "£4,200", submitted: "2h ago", proof: "1", status: "pending" },
  { id: "w2", name: "Aisha Khan", handle: "@aisha.k", draw: "Mar Jackpot", prize: "£10,500", submitted: "5h ago", proof: "2", status: "pending" },
  { id: "w3", name: "Noah Williams", handle: "@noahw", draw: "Mar Rolling 5", prize: "£2,800", submitted: "1d ago", proof: "3", status: "pending" },
  { id: "w4", name: "Sofia Mendes", handle: "@sofiam", draw: "Feb Rolling 5", prize: "£3,600", submitted: "3d ago", proof: "4", status: "paid" },
  { id: "w5", name: "Ethan Park", handle: "@ethanp", draw: "Feb Jackpot", prize: "£8,200", submitted: "5d ago", proof: "5", status: "rejected" },
];

function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    pending: "bg-yellow-500/10 text-yellow-300 ring-1 ring-yellow-500/30",
    paid: "bg-primary/15 text-primary ring-1 ring-primary/40 shadow-[0_0_24px_-8px_var(--emerald-glow)]",
    rejected: "bg-destructive/15 text-destructive-foreground ring-1 ring-destructive/40",
  };
  const Icon = status === "paid" ? CheckCircle2 : status === "rejected" ? X : Clock;
  const label = status === "paid" ? "Paid" : status === "rejected" ? "Rejected" : "Pending";
  return (
    <motion.span
      layout
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest ${styles[status]}`}
    >
      <Icon className="h-3 w-3" /> {label}
    </motion.span>
  );
}

function AdminWinners() {
  const [winners, setWinners] = useState<Winner[]>(SEED);
  const [open, setOpen] = useState<Winner | null>(null);

  const update = (id: string, status: Status) => {
    setWinners((w) => w.map((x) => (x.id === id ? { ...x, status } : x)));
    setOpen(null);
    if (status === "paid") toast.success("Payout approved.");
    if (status === "rejected") toast.error("Proof rejected.");
  };

  return (
    <AdminShell title="Winner Verification" subtitle="Review uploaded proofs and approve payouts.">
      <PageTransition>
        <div className="rounded-3xl glass-strong p-2 md:p-4">
          <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground md:grid">
            <span>Winner</span>
            <span>Draw</span>
            <span>Prize</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {winners.map((w) => (
                <motion.li
                  key={w.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 items-center gap-3 rounded-2xl glass px-4 py-4 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/40 to-secondary/30">
                      <Trophy className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.handle} · {w.submitted}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground"><span className="md:hidden text-xs uppercase tracking-widest mr-2">Draw:</span>{w.draw}</p>
                  <p className="font-display text-lg font-semibold text-gradient-emerald-cyan">{w.prize}</p>
                  <StatusBadge status={w.status} />
                  <div className="flex justify-end">
                    <button
                      onClick={() => setOpen(w)}
                      className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs text-foreground transition hover:bg-white/15"
                    >
                      <Eye className="h-3.5 w-3.5" /> Review
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>

        <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
          <DialogContent className="max-w-3xl border-white/10 bg-card/40 backdrop-blur-2xl">
            {open && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">{open.name} — {open.prize}</DialogTitle>
                  <DialogDescription>
                    {open.draw} · submitted {open.submitted}
                  </DialogDescription>
                </DialogHeader>

                <div className="relative mt-2 overflow-hidden rounded-2xl glass">
                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-primary/20 via-secondary/10 to-background">
                    <div className="grid h-full place-items-center text-center">
                      <div>
                        <Trophy className="mx-auto h-14 w-14 text-primary" />
                        <p className="mt-3 font-display text-xl">Proof screenshot #{open.proof}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Uploaded by {open.handle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => update(open.id, "paid")}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-semibold text-background shadow-[0_0_30px_-8px_var(--emerald-glow)] transition hover:brightness-110"
                  >
                    <Check className="h-4 w-4" /> Approve Payout
                  </button>
                  <button
                    onClick={() => update(open.id, "rejected")}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/15 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/25"
                  >
                    <X className="h-4 w-4" /> Reject Proof
                  </button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </PageTransition>
    </AdminShell>
  );
}
