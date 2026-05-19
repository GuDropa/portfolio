import { ThemeProvider } from '@/components/providers/ThemeProvider';
import '@/app/globals.scss';
import { GoogleAnalytics } from '@next/third-parties/google';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning data-scroll-behavior="smooth">
      <GoogleAnalytics gaId="G-L7YTDL8RTV" />
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
