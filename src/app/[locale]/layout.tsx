import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { LocaleHtml } from '@/components/providers/LocaleHtml';

export const metadata: Metadata = {
  title: 'Gustavo Dropa — Fullstack Developer',
  description: 'Portfolio of Gustavo Dropa, Fullstack Developer and Co-founder of FiqOn.',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'pt-br' | 'en')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider key={locale} locale={locale} messages={messages}>
      <LocaleHtml locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
