import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import PostHogProvider from "@/components/PostHogProvider";

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
    <html lang="en" className="">
      <body className="min-h-screen bg-linear-to-bl from-indigo-950/90 to-black  flex flex-col pb-10">
        <PostHogProvider>
          <Navbar />
          <main> {children}</main>
        </PostHogProvider>
      </body>
    </html>
  );
}
