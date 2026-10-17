import { BRAND } from '@/lib/brand';

export function Footer() {
  return (
    <footer className="mt-12 border-t-2 border-[#1C1917]/15 bg-[#FAF7F2]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-[#57534E] sm:flex-row sm:px-6">
        <span className="font-extrabold text-[#1C1917]">{BRAND.name}</span>
      </div>
    </footer>
  );
}
