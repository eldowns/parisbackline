import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paris Backline | Admin",
  description: "Rental management system for Paris Backline",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=bebas-neue:400|inter:300,400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
