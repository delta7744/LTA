"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import HotelSearchSidebar from "@/components/hotel-search-sidebar";
import HotelResults from "@/components/hotel-results";
import type { SearchDetails } from "@/lib/types";
import { TagProvider } from "@/context/TagContext";
import { CategoryProvider } from "@/context/CategoryContext";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export default function HotelsPage() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // Get default values
  const defaultCheckIn = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const defaultCheckOut = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Extract search parameters
  const cityId = Number.parseInt(searchParams.get("cityId") || "10", 10);
  const checkIn = searchParams.get("checkIn") || defaultCheckIn;
  const checkOut = searchParams.get("checkOut") || defaultCheckOut;

  const [searchDetails, setSearchDetails] = useState<SearchDetails>({
    BookingDetails: {
      CheckIn: checkIn,
      CheckOut: checkOut,
      City: cityId,
    },
    Filters: {
      Keywords: "",
      Category: [],
      OnlyAvailable: true,
      Tags: [],
    },
    Rooms: [{ Adult: 2 }],
  });

  // State to control sidebar visibility on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CategoryProvider>
      <TagProvider>
        {/* Header */}
        <div className="bg-lta-purple py-10 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lta-orange opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="container px-4 md:px-6 relative z-10 text-white">
            <h1 className="text-3xl md:text-5xl font-black mb-4">Hotels & Resorts</h1>
            <p className="text-white/80 max-w-2xl text-lg">Discover LTA's hand-picked premium accommodations for a truly exceptional stay.</p>
          </div>
        </div>

        {/* Mobile filter button */}
        <div className="container px-4 md:px-6 py-4 md:hidden">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-filter"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters & Search Options
          </Button>
        </div>

        {/* Main Content */}
        <div className="container px-4 md:px-6 flex flex-col md:flex-row py-4 md:py-12 gap-6 md:gap-8">
          <div
            className={`${sidebarOpen ? "block" : "hidden"
              } md:block w-full md:w-80 md:shrink-0 fixed md:static inset-0 z-40 bg-white md:bg-transparent overflow-auto md:overflow-visible`}
          >
            <div className="md:hidden p-4 flex justify-between items-center border-b">
              <h2 className="font-semibold">Filters & Search</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <HotelSearchSidebar
              initialSearch={searchDetails}
              onSearch={(details) => {
                setSearchDetails(details);
                setSidebarOpen(false);
              }}
            />
          </div>

          {/* Results */}
          <div className="flex-1">
            <HotelResults searchDetails={searchDetails} />
          </div>
        </div>
      </TagProvider>
    </CategoryProvider>
  );
}
