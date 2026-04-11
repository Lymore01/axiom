import { RootProvider } from "fumadocs-ui/provider/next";
import { Outfit } from "next/font/google";
import React from "react";
import "./global.css";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.className} axeom-scroll`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen bg-background">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
