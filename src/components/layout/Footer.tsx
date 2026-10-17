import { BRAND } from '@/lib/brand';

export function Footer() {
  return (
    <footer className="mt-12 border-t-2 border-border-ink/15 bg-warm-bg">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-ink-muted sm:flex-row sm:px-6">
        <span className="font-extrabold text-ink-charcoal">{BRAND.name}</span>
      </div>
    </footer>
  );
}
