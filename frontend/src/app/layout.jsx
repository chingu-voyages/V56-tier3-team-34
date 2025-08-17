import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Surgence - Surgery Status Board',
  description: 'Real-time surgical status tracking system for hospitals and clinics.',
  keywords: ['surgery', 'status board', 'real-time', 'tracking', 'hospital', 'clinic', 'surgical status'],
  authors: [{ name: 'Chingu Tier 3 Team 34' }],
  openGraph: {
    type: 'website',
    url: 'https://surgence-mu.vercel.app/',
    title: 'Surgence - Surgery Status Board',
    description: 'Real-time surgical status tracking system for hospitals and clinics.',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      {
        url: '/favicon/android-chrome-192x192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/favicon/android-chrome-512x512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gray-50">
              {children}
            </main>
            <Footer />
          </div>
          </Providers>
      </body>
    </html>
  );
}