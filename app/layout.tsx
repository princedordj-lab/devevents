import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DevEvent",
  description: "The Hub for every DevEvent you musn't miss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-linear-to-bl from-green-950/90 to-black">
      <Navbar />
      <body className="min-h-screen  flex flex-col pb-10">
        <main> {children}</main>
      </body>
    </html>
  );
}
