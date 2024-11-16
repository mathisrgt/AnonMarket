import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { NextUIProvider } from "@nextui-org/react";
import Providers from "./providers";
import Background from "../components/Background";

import { Funnel_Display } from "next/font/google";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "AnonMarket",
  description: "Mobile prediction market dApp that guarantees the confidentiality of its users' bets.",
};

const funnelDisplay = Funnel_Display({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className={`md:mt-16 mb-20 md:mb-0 px-4 relative ${funnelDisplay.className}`}>
            {children}
          </main>
          <Background />
        </Providers>
      </body>
    </html>
  );
}
