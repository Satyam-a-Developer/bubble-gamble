import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider"
import Link from "next/link";
import Navbar from "../app/Navbar/page"
const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Bubble-Gamble",
  description: "Created by Satyam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
