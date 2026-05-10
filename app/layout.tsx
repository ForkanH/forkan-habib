import type { Metadata } from 'next';
import { Inter, DM_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { CursorGlow } from '@/components/site/cursor-glow';
import './globals.css';

const geist = Inter({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Forkan — AI Automation Expert', template: '%s · Forkan' },
  description: 'I build intelligent systems that work while you sleep. n8n workflows, self-hosted infra, and AI-first products from Bangladesh.',
  openGraph: {
    title: 'Forkan — AI Automation Expert',
    description: 'AI Automation, n8n workflows, self-hosted infrastructure.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${dmSans.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CursorGlow/>
          {children}
          <Toaster position="bottom-right" theme="dark"/>
        </ThemeProvider>
      </body>
    </html>
  );
}
