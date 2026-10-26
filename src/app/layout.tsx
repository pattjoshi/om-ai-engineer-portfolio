import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import SpotifyWidget from "@/components/SpotifyWidget";
import CustomCursor from "@/components/CustomCursor";
import MusicPlayer from "@/components/MusicPlayer";
import Script from "next/script";
import "./globals.css";

// Load Inter font for non-Apple devices
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

// TODO: update once the site has its final custom domain
const SITE_URL = "https://om-ai-portfolio.vercel.app";

// Set NEXT_PUBLIC_GA_ID to your own GA4 measurement ID to enable analytics.
// Validated so a malformed value can never be injected into the inline script.
const rawGaId = process.env.NEXT_PUBLIC_GA_ID;
const GA_ID = rawGaId && /^G-[A-Z0-9]+$/.test(rawGaId) ? rawGaId : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Om Prakash Pattjoshi Portfolio",
  description: "Interactive portfolio with an AI-powered Memoji that answers questions about me, my skills, and my experience",
  keywords: [
    "Om Prakash Pattjoshi",
    "Portfolio",
    "GenAI Engineer",
    "LLM Engineer",
    "AI",
    "Interactive",
    "Memoji",
    "Web Development",
    "Full Stack",
    "Next.js",
    "React"
  ],
  authors: [
    {
      name: "Om Prakash Pattjoshi",
      url: SITE_URL,
    },
  ],
  creator: "Om Prakash Pattjoshi",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: "Om Prakash Pattjoshi Portfolio",
    description: "Interactive portfolio with an AI-powered Memoji that answers questions about me",
    siteName: "Om Prakash Pattjoshi Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Om Prakash Pattjoshi Portfolio",
    description: "Interactive portfolio with an AI-powered Memoji that answers questions about me",
    creator: "@ompattjoshi",
  },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "64x64", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.png" sizes="64x64" type="image/png" />
        {/* Google Analytics — only when your own measurement ID is set */}
        {GA_ID && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window['dataLayer'] = window['dataLayer'] || [];
                  function gtag(){window['dataLayer'].push(arguments);}
                  gtag('js', new Date());
                  gtag('config', ${JSON.stringify(GA_ID)});
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={cn(
          // "min-h-screen bg-background font-sans antialiased",
          "min-h-screen bg-white text-black dark:bg-black dark:text-white font-sans antialiased transition-colors duration-500 ease-in-out",
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <main className="flex min-h-screen flex-col">
            {children}
          </main>
          <CustomCursor />
          <MusicPlayer />
          <SpotifyWidget />
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}