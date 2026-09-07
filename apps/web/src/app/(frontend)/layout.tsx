import type { Metadata } from "next";
import { Poppins, Inter, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { getPayloadClient } from "@/lib/payload";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PortalTopbar } from "@/components/portal-topbar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayloadClient();
  const settings = await payload.findGlobal({ slug: "site-settings" });
  return {
    title: settings.seoDefaults?.defaultTitle || "South Coast Residents' Association",
    description:
      settings.seoDefaults?.defaultDescription ||
      "Representing residents, property owners and businesses from Likoni to Lunga Lunga.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const payload = await getPayloadClient();
  const [settings, navigation] = await Promise.all([
    payload.findGlobal({ slug: "site-settings" }),
    payload.findGlobal({ slug: "main-navigation" }),
  ]);

  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
            strategy="afterInteractive"
          />
        )}
        <SiteHeader settings={settings} navigation={navigation} />
        <PortalTopbar />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} navigation={navigation} />
      </body>
    </html>
  );
}
