import type React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CityProvider } from "@/context/CityContext";
import { LanguageProvider } from "@/components/language-provider";

export const metadata: Metadata = {
  title: "LTA - Leader Travel Agency | Explore with Confidence",
  description: "Leader Travel Agency (LTA) offers premium flight booking, hotel reservations, and customized travel packages worldwide.",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LanguageProvider>
        <CityProvider>
          <Navbar />
          {children}
          <Footer />
        </CityProvider>
      </LanguageProvider>
    </div>
  );
}
