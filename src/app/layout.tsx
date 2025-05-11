import type { Metadata } from 'next';
import { Inter, Chakra_Petch, Space_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const chakraPetch = Chakra_Petch({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-chakra-petch'
});
const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono'
});

export const metadata: Metadata = {
  title: 'SchönMo | Premium Custom Bicycle Frames & Wheelsets',
  description: 'Hand-crafted custom bicycle wheelsets and framesets built to your exact specifications. Professional-grade components for cyclists who demand excellence.',
  keywords: 'custom bicycle, carbon fiber, bike frames, wheelsets, premium bikes, custom cycling',
  authors: [{ name: 'SchönMo' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'SchönMo | Premium Custom Bicycle Frames & Wheelsets',
    description: 'Hand-crafted custom bicycle wheelsets and framesets built to your exact specifications.',
    url: 'https://schonmo.com',
    siteName: 'SchönMo',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SchönMo Custom Bicycles',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${chakraPetch.variable} ${spaceMono.variable} font-sans bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
} 