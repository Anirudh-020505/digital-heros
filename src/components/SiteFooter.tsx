export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-5 py-12">
      <div className="rounded-2xl glass px-6 py-5 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
        <p>© {new Date().getFullYear()} Digital Heroes. Performance with purpose.</p>
        <p className="font-mono text-xs uppercase tracking-[0.2em]">
          v1.0 · obsidian build
        </p>
      </div>
    </footer>
  );
}
