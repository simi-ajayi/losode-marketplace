import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "./globals.css";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AppProviders } from "@/providers/app-providers";

export const metadata: Metadata = {
  title: "Losode Marketplace",
  description:
    "Losode-inspired storefront built with Next.js App Router, TypeScript, TanStack Query, Redux Toolkit, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#f9f4eb] text-[#1b1b1b]">
        <AntdRegistry>
          <AppProviders>
            <div className="relative min-h-screen overflow-x-clip">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,#f4ead9_0%,transparent_35%),radial-gradient(circle_at_20%_30%,#f8efe3_0%,transparent_32%),linear-gradient(180deg,#fcf9f4_0%,#f9f3e9_100%)]" />
              <SiteHeader />
              <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
                {children}
              </main>
              <SiteFooter />
            </div>
          </AppProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
