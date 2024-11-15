import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { NextUIProvider } from "@nextui-org/react";
import Providers from "./providers";

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
          {children}
        </Providers>
      </body>
    </html>
  );
}
