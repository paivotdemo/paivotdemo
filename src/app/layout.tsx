import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClientProvider } from "./providers";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PAIVOT - Career Guidance Platform",
  description: "AI-powered career guidance and professional development platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased bg-black text-white`}>
        <ClientProvider>
          <Navbar />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}
