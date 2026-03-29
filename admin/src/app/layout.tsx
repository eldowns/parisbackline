import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://parisbackline.com"),
  title: {
    default: "Paris Backline | Los Angeles Backline & Audio Equipment Rental",
    template: "%s | Paris Backline",
  },
  description: "Professional backline and wireless audio equipment rental across Greater Los Angeles.",
  verification: {
    google: "",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=bebas-neue:400|inter:300,400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <div id="dot-grid" />
        {children}
      </body>
    </html>
  );
}
