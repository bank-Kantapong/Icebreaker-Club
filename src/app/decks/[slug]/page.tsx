import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DECKS, getDeckBySlug } from '@/content/decks';
import { getCardsByDeckSlug } from '@/content/cards';
import { BRAND } from '@/lib/brand';
import { getSiteUrl } from '@/lib/url';
import { BackToHomeLink } from '@/components/deck/BackToHomeLink';
import { DeckOverviewHero } from '@/components/deck/DeckOverviewHero';
import { DeckSetupPanel } from '@/components/deck/DeckSetupPanel';
import { DeckRulesCard } from '@/components/deck/DeckRulesCard';

interface DeckDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return DECKS.map((deck) => ({ slug: deck.slug }));
}

export async function generateMetadata({
  params,
}: DeckDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const deck = getDeckBySlug(slug);
  if (!deck) {
    return {
      title: 'ไม่พบกองไพ่',
    };
  }

  const cards = getCardsByDeckSlug(deck.slug);
  const siteUrl = getSiteUrl();
  const title = `สำรับ "${deck.titleTh}" (${deck.titleEn}) — ${cards.length} ใบ`;
  const description = deck.shortDescription.th;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${BRAND.name}`,
      description,
      type: 'website',
      locale: BRAND.defaultLocale,
      siteName: BRAND.name,
    },
    ...(siteUrl
      ? {
          alternates: {
            canonical: `/decks/${deck.slug}`,
          },
        }
      : {}),
  };
}

export default async function DeckDetailPage({ params }: DeckDetailPageProps) {
  const { slug } = await params;
  const deck = getDeckBySlug(slug);
  if (!deck) {
    notFound();
  }

  const cards = getCardsByDeckSlug(deck.slug);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <div>
        <BackToHomeLink />
      </div>

      <DeckOverviewHero deck={deck} cardCount={cards.length} />

      <DeckSetupPanel deck={deck} cards={cards} />

      <DeckRulesCard deck={deck} />
    </div>
  );
}
