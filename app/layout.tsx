import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import {
  ClerkProvider,
} from '@clerk/nextjs';
import "./globals.css";
import { ExitModal } from "@/components/modals/exit-modal";
import { HeartsModal } from "@/components/modals/hearts-modal";
import { PracticeModal } from "@/components/modals/practice-modal";

const font = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tastify",
  description: "The new way to learn about cuisines around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider>
    <html lang="en">
      <body className={`${font.variable} antialiased`}>
        <Toaster />
        <ExitModal />
        <HeartsModal />
        <PracticeModal />
        { children }
      </body>
    </html>
  </ClerkProvider>
);
}