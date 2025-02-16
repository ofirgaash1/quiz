import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Learn English - Ofir Gaash",
  description: "Learn English / Hebrew from TV shows and movies",
};

export default function RootLayout(
  { children }: Readonly<{ children: React.ReactNode; }>
) {

  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-secondary flex flex-col text-dark">
          <Navbar />
          <div className="min-h-[700px]">
          {children}
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
