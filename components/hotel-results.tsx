"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SearchDetails, Hotel } from "@/lib/types";
import { useLanguage } from "./language-provider";

interface HotelResultsProps {
  searchDetails: SearchDetails;
}

export default function HotelResults({ searchDetails }: HotelResultsProps) {
  const { t } = useLanguage();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);

      try {
        // Prepare the search data for the API
        const apiData = {
          SearchDetails: {
            BookingDetails: {
              CheckIn: searchDetails.BookingDetails.CheckIn,
              CheckOut: searchDetails.BookingDetails.CheckOut,
              City: searchDetails.BookingDetails.City,
            },
            Filters: searchDetails.Filters,
            Rooms: searchDetails.Rooms,
          },
        };

        // Call the API
        const response = await fetch("/api/hotel/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: apiData,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        // Handle the response data

        console.log("apidata", apiData);
        console.log("API Response:", result);
        setHotels(result.HotelSearch || []);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setError("Failed to load hotels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchDetails]);

  // Apply filters whenever hotels or search details change
  useEffect(() => {
    let filtered = [...hotels];

    // Apply tag filter from searchDetails
    if (searchDetails.Filters.Tags && searchDetails.Filters.Tags.length > 0) {
      filtered = filtered.filter((hotel) =>
        hotel.Hotel.Theme.some((theme) =>
          searchDetails.Filters.Tags?.includes(theme)
        )
      );
    }

    // Apply keyword filter from searchDetails
    if (searchDetails.Filters.Keywords) {
      const keyword = searchDetails.Filters.Keywords.toLowerCase();
      filtered = filtered.filter(
        (hotel) =>
          hotel.Hotel.Name.toLowerCase().includes(keyword) ||
          hotel.Hotel.City.Name.toLowerCase().includes(keyword)
      );
    }

    // Apply category filter from searchDetails
    if (searchDetails.Filters.Category.length > 0) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.Hotel.Category.Id !== null &&
          searchDetails.Filters.Category.includes(hotel.Hotel.Category.Id)
      );
    }

    // Sort by recommended first, then by price
    filtered.sort((a, b) => {
      if (a.Recommended !== b.Recommended) {
        return b.Recommended - a.Recommended;
      }
      return (
        Number.parseFloat(a.Price.BasePrice) -
        Number.parseFloat(b.Price.BasePrice)
      );
    });

    setFilteredHotels(filtered);
  }, [hotels, searchDetails]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center"></div>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md p-4 animate-pulse"
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-1/3 h-48 bg-gray-200 rounded-md"></div>
              <div className="w-full md:w-2/3 space-y-3 md:space-y-4 mt-3 md:mt-0">
                <div className="h-6 md:h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-8 md:h-10 bg-gray-200 rounded w-full md:w-1/4 mt-4 md:mt-6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-lta-purple mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Error Loading Hotels</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {t.navbar.hotels} {t.hotelSearchPage.found} : {filteredHotels.length}
        </h2>
      </div>

      <div className="space-y-6">
        {filteredHotels.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">
              {t.hotelSearchPage.noHotelFound}
            </h3>
            <p className="text-muted-foreground">{t.buttons.reset}</p>
          </div>
        ) : (
          filteredHotels.map((hotel) => (
            <Card key={hotel.Hotel.Id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 relative h-56 md:h-auto">
                  <Image
                    src={
                      hotel.Hotel.Image ||
                      "/placeholder.svg?height=400&width=600" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={hotel.Hotel.Name}
                    fill
                    className="object-cover"
                  />
                  {hotel.Recommended === 1 && (
                    <Badge className="absolute top-2 left-2 bg-green-500 text-white border-none">
                      Recommended
                    </Badge>
                  )}
                </div>

                <CardContent className="w-full md:w-2/3 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-xl font-semibold mb-1">
                        {hotel.Hotel.Name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{hotel.Hotel.Adress}</span>
                      </div>
                      <div className="flex items-center mb-4">
                        {hotel.Hotel.Category.Star && (
                          <div className="flex items-center">
                            {Array.from({
                              length: hotel.Hotel.Category.Star,
                            }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-yellow-400"
                              />
                            ))}
                          </div>
                        )}
                        <span className="ml-2 text-sm">
                          {hotel.Hotel.Category.Title}
                        </span>
                      </div>
                    </div>

                    <div className="text-left md:text-right border-t pt-3 md:border-0 md:pt-0">
                      <div className="text-sm text-muted-foreground">
                        {t.general.from}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {Number.parseFloat(hotel.Price.BasePrice).toFixed(3)}{" "}
                        {hotel.Currency}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.hotelSearchPage.perNight}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 mt-3 md:mt-0">
                    {hotel?.Hotel.Theme?.slice(0, 4).map((theme, index) => (
                      <Badge key={index} variant="outline">
                        {theme}
                      </Badge>
                    ))}
                    {hotel.Hotel?.Theme?.length > 4 && (
                      <Badge variant="outline">
                        +{hotel.Hotel?.Theme?.length - 4} {t.general.other}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 gap-3 md:gap-0">
                    <div className="text-sm text-muted-foreground">
                      {searchDetails.Rooms.reduce(
                        (total, room) => total + room.Adult,
                        0
                      )}{" "}
                      {t.hotelSearchPage.adults},{" "}
                      {searchDetails.Rooms.reduce(
                        (total, room) => total + (room.Child?.length || 0),
                        0
                      )}{" "}
                      {t.hotelSearchPage.children}, {searchDetails.Rooms.length}{" "}
                      {t.hotelSearchPage.room}
                    </div>

                    <Button
                      className="w-full md:w-auto gap-2 bg-lta-purple hover:bg-lta-purple/90"
                      asChild
                    >
                      <Link
                        href={{
                          pathname: `/hotels/${hotel.Hotel.Id}`,
                          query: {
                            search: JSON.stringify({
                              ...searchDetails,
                              BookingDetails: {
                                ...searchDetails.BookingDetails,
                                Hotel: [hotel.Hotel.Id],
                                City: undefined,
                              },
                            }),
                          },
                        }}
                      >
                        {t.buttons.viewDetails}{" "}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
