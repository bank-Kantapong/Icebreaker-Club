import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DECKS, getDeckBySlug } from '@/content/decks';
import { getCardsByDeckSlug } from '@/content/cards';
import { parseIntensityFilter } from '@/features/game/gameState';
import { BRAND } from '@/lib/brand';
import { getSiteUrl } from '@/lib/url';
import { GameBoard } from '@/components/game/GameBoard';

interface PlayDeckPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ intensity?: string }>;
}

export function generateStaticParams() {
  return DECKS.map((deck) => ({ slug: deck.slug }));
}

export async function generateMetadata({
  params,
}: PlayDeckPageProps): Promise<Metadata> {
  const { slug } = await params;
  const deck = getDeckBySlug(slug);
  if (!deck) {
    return {
      title: 'ไม่พบกองไพ่',
    };
  }

  const siteUrl = getSiteUrl();
  const title = `กำลังเล่นสำรับ "${deck.titleTh}" (${deck.titleEn})`;
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
            canonical: `/play/${deck.slug}`,
          },
        }
      : {}),
  };
}

export default async function PlayDeckPage({
  params,
  searchParams,
}: PlayDeckPageProps) {
  const { slug } = await params;
  const { intensity } = await searchParams;

  const deck = getDeckBySlug(slug);
  if (!deck) {
    notFound();
  }

  const allDeckCards = getCardsByDeckSlug(deck.slug);
  const initialIntensity = parseIntensityFilter(intensity);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <GameBoard
        deck={deck}
        allDeckCards={allDeckCards}
        initialIntensity={initialIntensity}
      />
    </div>
  );
}
