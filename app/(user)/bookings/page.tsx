"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";

export default function BookingManagementPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [reference, setReference] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reference.trim()) {
      setError("Please enter a booking reference");
      return;
    }

    setIsSearching(true);
    setError("");

    // Navigate to the booking details page
    router.push(`/bookings/${reference}`);
  };

  return (
    <>
      <div className="bg-lta-purple py-10 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lta-orange opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="container px-4 md:px-6 relative z-10 text-white">
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            {t.bookingManagementPage.title}
          </h1>
          <p className="text-white/80 max-w-2xl text-lg">
            {t.bookingManagementPage.description}
          </p>
        </div>
      </div>

      <div className="container flex items-center justify-center py-8">
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle>{t.bookingManagementPage.card.title}</CardTitle>
            <CardDescription>
              {t.bookingManagementPage.card.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    placeholder={t.bookingManagementPage.form.placeholder}
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    className="w-full"
                  />
                  {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSearching}
                  className="min-w-[100px] bg-lta-purple hover:bg-lta-purple/90"
                >
                  {isSearching ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {t.bookingManagementPage.form.buttons.searching}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm">
                      <Search className="h-4 w-4" />
                      {t.bookingManagementPage.form.buttons.search}
                    </span>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-8 space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-medium mb-2">
                  {t.bookingManagementPage.referenceFormat.title}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">
                      {t.bookingManagementPage.referenceFormat.hotels.label}:
                    </span>
                    <span>
                      {t.bookingManagementPage.referenceFormat.hotels.example}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-[80px]">
                      {t.bookingManagementPage.referenceFormat.services.label}:
                    </span>
                    <span>
                      {t.bookingManagementPage.referenceFormat.services.example}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>{t.bookingManagementPage.help.findReference}</p>
                <p className="mt-1">
                  {t.bookingManagementPage.help.contactSupport}{" "}
                  <a
                    href={`mailto:${t.bookingManagementPage.help.supportEmail}`}
                    className="text-lta-purple underline"
                  >
                    {t.supportEmail}
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
