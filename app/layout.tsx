import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/cookie-consent";
import { AnalyticsLoader } from "@/components/analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: {
    default: "All Star Champions | Brooklyn's Premier Soccer Tournament",
    template: "%s | All Star Champions",
  },
  description:
    "One Game. One Dream. One Champion. Brooklyn's premier community soccer tournament at SoFive. Register your team today.",
  keywords: "soccer, tournament, Brooklyn, football, All Star Champions, SoFive",
  metadataBase: new URL("https://allstarchampions.vercel.app"),
  openGraph: {
    title: "All Star Champions | Brooklyn's Premier Soccer Tournament",
    description:
      "One Game. One Dream. One Champion. Brooklyn's premier community soccer tournament at SoFive.",
    type: "website",
    url: "https://allstarchampions.vercel.app",
    images: [
      {
        url: "/hero-player.png",
        width: 1200,
        height: 630,
        alt: "All Star Champions — Brooklyn Soccer Tournament",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Star Champions | Brooklyn's Premier Soccer Tournament",
    description:
      "One Game. One Dream. One Champion. Brooklyn's premier community soccer tournament at SoFive.",
    images: ["/hero-player.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F5F0EB] text-[#0A1628]">
        <Providers>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <CookieConsent />
          <AnalyticsLoader />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
