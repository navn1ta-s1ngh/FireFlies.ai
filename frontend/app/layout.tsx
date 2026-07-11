import type { Metadata } from "next";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { QueryProvider } from "@/lib/query-client";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Meeting Notes & Transcription",
  description: "A meeting notes and transcription workspace scaffold."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-background text-text-primary">
      <body className="min-h-screen bg-background text-text-primary">
        <QueryProvider>
          <div className="flex min-h-screen flex-col bg-background text-text-primary">
            <Header />
            <main className="flex-1 px-4 pb-6 pt-16 sm:px-6 sm:pt-20 lg:px-8">
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">{children}</div>
            </main>
            <Footer />
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}

