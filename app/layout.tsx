import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
import { CookieConsent } from "@/components/cookie-consent";
import { AnalyticsLoader } from "@/components/analytics";

export const metadata: Metadata = {
  title: "All Star Champions | Brooklyn's Premier Soccer Tournament",
  description: "One Game. One Dream. One Champion. Brooklyn's premier community soccer tournament at SoFive. Register your team today.",
  keywords: "soccer, tournament, Brooklyn, football, All Star Champions, SoFive",
  openGraph: {
    title: "All Star Champions",
    description: "Brooklyn's Premier Soccer Tournament",
    type: "website",
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
      </body>
    </html>
  );
}
