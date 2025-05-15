
import type {Metadata} from 'next';
import { Inter as FontSans } from "next/font/google" // Using Inter as a fallback for Geist
import './globals.css';
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'RoamEasy - Your Smart Trip Planner',
  description: 'Plan your adventures effortlessly with RoamEasy, powered by AI.',
  icons: {
    icon: '/favicon.ico', // This will be a placeholder, actual favicon not generated
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
        {children}
      </body>
    </html>
  );
}
