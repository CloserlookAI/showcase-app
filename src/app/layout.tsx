import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidgetProvider from "@/components/ChatWidgetProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lifeway Foods - Business Intelligence Dashboard",
  description: "Comprehensive business analytics and intelligence dashboard for Lifeway Foods",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (!process.env.NEXT_PUBLIC_AGENT_NAME) {
                console.warn('NEXT_PUBLIC_AGENT_NAME environment variable is not set');
              }
            `,
          }}
        />
        <ChatWidgetProvider>
          {children}
        </ChatWidgetProvider>
      </body>
    </html>
  );
}
