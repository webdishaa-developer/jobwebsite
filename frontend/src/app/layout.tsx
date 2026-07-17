import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: 'Recluta Talent Management | Leading HR Consultancy in India',
    template: '%s | Recluta Talent Management',
  },
  description:
    'Recluta Talent Management Pvt Ltd - Your trusted HR and recruitment partner. Find top talent, executive search, payroll, staffing and HR consulting solutions across India. CIN: U93090CT2020PTC010332',
  keywords: [
    'recruitment agency india',
    'hr consultancy bilaspur',
    'talent management',
    'executive search',
    'staffing solutions',
    'it hiring',
    'manufacturing recruitment',
    'bfsi hiring',
    'bulk hiring',
    'payroll services',
    'hr outsourcing',
    'recluta talent management',
    'jobs in india',
    'chhattisgarh jobs',
  ],
  authors: [{ name: 'Recluta Talent Management Pvt Ltd' }],
  creator: 'Recluta Talent Management Pvt Ltd',
  publisher: 'Recluta Talent Management Pvt Ltd',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://reclutasolutions.in',
    siteName: 'Recluta Talent Management',
    title: 'Recluta Talent Management | Leading HR Consultancy in India',
    description:
      'Your trusted HR and recruitment partner. Expert staffing, executive search, and HR solutions across India.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Recluta Talent Management',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Recluta Talent Management',
    description:
      'Leading HR consultancy providing manpower recruitment and HR solutions across India.',
    images: ['/og-image.jpg'],
  },

  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#ffffff',
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#0a1628',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e3a8a',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#06b6d4',
                  secondary: '#ffffff',
                },
              },
              error: {
                style: {
                  background: '#991b1b',
                  color: '#ffffff',
                },
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}