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
      <body className="min-h-full bg-[#ffffff] text-[#1b1b1b]">
        <AntdRegistry>
          <AppProviders>
            <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[#ffffff]">
              <SiteHeader />
              <main className="mx-auto w-full max-w-[1880px] flex-1">
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
