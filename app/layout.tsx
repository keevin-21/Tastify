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
  icons: {
    icon: "mascot.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <ClerkProvider
    appearance={{
      baseTheme: undefined,
      variables: {
        colorPrimary: "#FF6F1F",
        colorBackground: "#1e1e1e",
        colorInputBackground: "#2c2c2c",
        colorInputText: "#f5f5f5",
        colorText: "#f5f5f5",
        colorTextSecondary: "#a1a1aa",
        colorSuccess: "#22c55e",
        colorDanger: "#ef4444",
        colorWarning: "#f59e0b",
        colorNeutral: "#71717a",
        fontFamily: "var(--font-nunito)",
        borderRadius: "0.75rem",
      },
      elements: {
        modalContent: {
          backgroundColor: "#1e1e1e",
          border: "1px solid #2c2c2c",
          borderRadius: "0.75rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
        },
        modalCloseButton: {
          color: "#f5f5f5",
          "&:hover": {
            backgroundColor: "#2c2c2c",
          },
        },
        card: {
          backgroundColor: "#1e1e1e",
          border: "1px solid #2c2c2c",
          borderRadius: "0.75rem",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.6)",
        },
        headerTitle: {
          color: "#f5f5f5",
          fontWeight: "700",
        },
        headerSubtitle: {
          color: "#a1a1aa",
        },
        socialButtonsBlockButton: {
          backgroundColor: "#2c2c2c",
          border: "1px solid #3c3c3c",
          color: "#f5f5f5",
          "&:hover": {
            backgroundColor: "#3c3c3c",
            transform: "translateY(-1px)",
          },
        },
        socialButtonsBlockButtonText: {
          color: "#f5f5f5",
          fontWeight: "600",
        },
        dividerLine: {
          backgroundColor: "#2c2c2c",
        },
        dividerText: {
          color: "#a1a1aa",
        },
        formFieldLabel: {
          color: "#f5f5f5",
          fontWeight: "600",
        },
        formFieldInput: {
          backgroundColor: "#2c2c2c",
          border: "1px solid #3c3c3c",
          color: "#f5f5f5",
          "&:focus": {
            borderColor: "#FF6F1F",
            boxShadow: "0 0 0 2px rgba(255, 111, 31, 0.2)",
          },
        },
        formButtonPrimary: {
          backgroundColor: "#FF6F1F",
          border: "none",
          color: "#ffffff",
          fontWeight: "700",
          "&:hover": {
            backgroundColor: "#e55a0f",
            transform: "translateY(-1px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        footerActionLink: {
          color: "#FF6F1F",
          "&:hover": {
            color: "#e55a0f",
          },
        },
        identityPreviewText: {
          color: "#f5f5f5",
        },
        identityPreviewEditButton: {
          color: "#FF6F1F",
          "&:hover": {
            color: "#e55a0f",
          },
        },
        formFieldErrorText: {
          color: "#ef4444",
        },
        formFieldSuccessText: {
          color: "#22c55e",
        },
        alertText: {
          color: "#f5f5f5",
        },
        formFieldHintText: {
          color: "#a1a1aa",
        },
        otpCodeFieldInput: {
          backgroundColor: "#2c2c2c",
          border: "1px solid #3c3c3c",
          color: "#f5f5f5",
          "&:focus": {
            borderColor: "#FF6F1F",
            boxShadow: "0 0 0 2px rgba(255, 111, 31, 0.2)",
          },
        },
        formResendCodeLink: {
          color: "#FF6F1F",
          "&:hover": {
            color: "#e55a0f",
          },
        },
        navbar: {
          backgroundColor: "#1e1e1e",
          borderBottom: "1px solid #2c2c2c",
        },
        navbarButton: {
          color: "#f5f5f5",
          "&:hover": {
            backgroundColor: "#2c2c2c",
          },
        },
        profileSectionPrimaryButton: {
          backgroundColor: "#FF6F1F",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#e55a0f",
          },
        },
        badge: {
          backgroundColor: "#2c2c2c",
          color: "#f5f5f5",
        },
      },
    }}
  >
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