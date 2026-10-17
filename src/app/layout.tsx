import type { Metadata, Viewport } from 'next';
import { Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { BRAND } from '@/lib/brand';
import { getSiteUrl } from '@/lib/url';
import { I18nProvider } from '@/i18n/I18nProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: siteUrl } : {}),
  title: {
    default: `${BRAND.name} — ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.subtitle,
  openGraph: {
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description: BRAND.subtitle,
    type: 'website',
    locale: BRAND.defaultLocale,
    siteName: BRAND.name,
  },
  ...(siteUrl ? { alternates: { canonical: '/' } } : {}),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAF7F2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${notoSansThai.className} min-h-screen flex flex-col`}
      >
        <I18nProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
