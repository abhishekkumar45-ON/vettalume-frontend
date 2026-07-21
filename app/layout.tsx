import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import Providers from "@/components/Providers";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint so dark-mode users never see a light flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('vetta:theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}"
          }}
        />
      </head>
      <body className={hankenGrotesk.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
