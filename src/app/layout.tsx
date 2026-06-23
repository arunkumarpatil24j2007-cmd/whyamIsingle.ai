import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ScrollProvider from "@/components/ScrollProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "WhyAmISingle.ai | Premium Cinematic Relationship AI Analysis",
  description: "Upload an image and analyze your single status. Deep-dive into assumptions, red flags, green flags, and your love forecast with Gemini 2.5 Flash Vision.",
  openGraph: {
    title: "WhyAmISingle.ai | Premium Cinematic AI Analysis",
    description: "Are you actually single, or just misunderstood? Calculate your single score and review your future wife ratings.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090B] text-white">
        <ScrollProvider>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
