import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { NextUIProvider } from "@nextui-org/react";
import Providers from "./providers";
import NavBar from "../components/NavBar";

export const metadata: Metadata = {
  title: "AnonMarket",
  description: "Mobile prediction market dApp that guarantees the confidentiality of its users' bets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NavBar />
          <main className="md:mt-16 mb-20 md:mb-0 px-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
