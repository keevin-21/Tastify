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
import { StreakUpdater } from "@/components/streak-updater";
import { cn } from "@/lib/utils";

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
      <body className={cn(font.variable, "bg-[#1e1e1e] antialiased")}>
        <Toaster />
        <ExitModal />
        <HeartsModal />
        <PracticeModal />
        <StreakUpdater />
        { children }
      </body>
    </html>
  </ClerkProvider>
);
}