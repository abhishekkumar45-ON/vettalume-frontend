import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap"
});

export const metadata: Metadata = {
  title: "VettaLume | Fastest Path To Your Target Percentile",
  description:
    "Personalized adaptive prep for CAT, GMAT, and GRE aspirants."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={hankenGrotesk.variable}>{children}</body>
    </html>
  );
}
